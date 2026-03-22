import mongoose from "mongoose";

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

export const User = mongoose.model("User", userSchema)