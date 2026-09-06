const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
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
      enum: ["Male", "Female", "Other"]
    },

    occupation: {
      type: String,
      default: ""
    },

    block: {
      type: String,
      default: ""
    },

    flat: {
      type: String,
      default: ""
    },

    members: {
      type: Number,
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