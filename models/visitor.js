const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
{
    visitorName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    residentName: {
        type: String,
        required: true
    },

    flatNumber: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        required: true
    },

    entryTime: {
        type: Date,
        default: Date.now
    },

    exitTime: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: ["Waiting", "Entered", "Exited"],
        default: "Waiting"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Visitor", visitorSchema);