import { log } from "console";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const logsSchema = new Schema({
    gitId: {
        type: Number,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    log: {
        type: Object,
        required: true,
    },
});

export default mongoose.model("Logs", logsSchema);