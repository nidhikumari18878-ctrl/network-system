const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

   published: { type: Boolean, default: true },

    status: {
        type: String,
        enum: ["Published", "Draft"],
        default: "Draft"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Notice", noticeSchema);