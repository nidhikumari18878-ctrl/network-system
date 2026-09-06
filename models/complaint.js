const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    resident: {
        type: String,
        required: true
    },

    // flat: {
    //     type: String,
    //     required: true
    // },

    category: {
        type: String,
        required: true
    },

    // complaint: {
    //     type: String,
    //     required: true
    // },
    description: { type: String },

   status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Complaint",
    complaintSchema
);