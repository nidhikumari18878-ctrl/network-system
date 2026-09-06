const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
    {
        flatNumber: {
            type: String,
            required: true,
            unique: true
        },

        block: {
            type: String
        },

        floor: {
            type: Number
        },

        status: {
            type: String,
            enum: ["Occupied", "Vacant"],
            default: "Vacant"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Flat", flatSchema);