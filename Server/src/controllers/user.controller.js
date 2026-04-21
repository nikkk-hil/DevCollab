import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinaryService.js";


const generateAccessAndRefreshToken = async (existedUser) => {
  const accessToken = existedUser.generateAccessToken();
  const refreshToken = existedUser.generateRefreshToken();

  existedUser.refreshToken = refreshToken;
  await existedUser.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const getUser = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user?._id).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found.");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully."));
})

const getUserByUsernameOrEmail = asyncHandler(async (req, res) => {
  const { usernameOrEmail } = req.query;

  if (!usernameOrEmail?.trim()) {
    throw new ApiError(400, "Username or email is required.");
  }

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found.");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully."));

})

const userRegistration = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => field.trim() === "")
  )
    throw new ApiError(400, "All field is required");

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) throw new ApiError(400, "User is already existed");

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required.");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) throw new ApiError(500, "Upload on cloudinary failed");

  const newUser = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatar?.url,
  });

  const createdUser = await User.findOne({ username: username }).select(
    "-password -refreshToken",
  );

  if (!createdUser)
    throw new ApiError(500, "User is not registered to the database.");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully!"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required.");
  }

  if (!password) throw new ApiError(400, "Password is required.");

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!existedUser)
    throw new ApiError(
      404,
      "User with this username or password doesn't exist",
    );

  if (!(await existedUser.isPasswordCorrect(password)))
    throw new ApiError(
      404,
      "User with this username or password doesn't exist",
    );

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(existedUser);

  const loggedInUser = await User.findById(existedUser._id).select(
    "-password -refreshToken",
  );

  if (!loggedInUser)
    throw new ApiError(
      500,
      "Something went wrong while feteching logged in user from db.",
    );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully."));
});

const userLogout = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "User is not authorized to logout.");

  const user = await User.findById(userId).select("-password");

  user.refreshToken = "";
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new ApiError(401, "Unauthorized Request.");

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) throw new ApiError(401, "Token expired!");

  if (user.refreshToken !== refreshToken)
    throw new ApiError(
      401,
      "User is not authorized to generate new access token.",
    );

  const accessToken = user.generateAccessToken();

  if (!accessToken) throw new ApiError(500, "Access Token is not generated.");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, {}, "New access token generated"));
});

export { getUser, getUserByUsernameOrEmail, userRegistration, userLogin, userLogout, refreshAccessToken };
