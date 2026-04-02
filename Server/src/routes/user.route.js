import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { userRegistration, userLogin, userLogout, refreshAccessToken } from "../controllers/user.controller.js"


const router = Router();

router.route("/register").post(upload.single("avatar"), userRegistration);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout)
router.route("/refresh-access-token").post(refreshAccessToken);


export default router