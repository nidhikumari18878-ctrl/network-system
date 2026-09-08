const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        postedBy: {
            type: String,
            default: "Admin",
            trim: true
        },

        published: {
            type: Boolean,
            default: true
        },

        status: {
            type: String,
            enum: ["Published", "Draft"],
            default: "Draft"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notice",
    noticeSchema
);