
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 150,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [
                /^[0-9+\-\s()]{7,20}$/,
                "Please enter a valid phone number"
            ]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6
        },

        role: {
            type: String,
            enum: ["admin", "resident", "security"],
            default: "resident"
        },

        profileImage: {
            type: String,
            default: ""
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: undefined
        },

        occupation: {
            type: String,
            trim: true,
            default: ""
        },

        block: {
            type: String,
            trim: true,
            default: ""
        },

        flat: {
            type: String,
            trim: true,
            default: ""
        },

        members: {
            type: Number,
            min: 1,
            default: 1
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);

