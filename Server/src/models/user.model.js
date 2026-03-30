import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required."],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    avatar: {
        type: String,
        required: [true, "Avatar is required."]
    }
},{timestamps: true});

userSchema.pre("save", async function(next){
    if (!this.isModified("password"))
        return next()

    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema)