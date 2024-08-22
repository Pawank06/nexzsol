import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    gitId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
        required: true,
    },
    solanaAddress: {  // Updated to camelCase
        type: String,
        required: false,
    },
});

const User = mongoose.model("User", userSchema);
export default User;