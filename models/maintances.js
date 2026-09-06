const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({

    residentName: {
        type: String,
        required: true
    },

    flatNumber: {
        type: String,
        required: true
    },

    block: {
        type: String,
        required: true
    },

    month: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);