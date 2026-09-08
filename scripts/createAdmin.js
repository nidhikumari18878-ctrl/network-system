const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const adminEmail = "admin@smartsociety.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await User.create({
            name: "Super Admin",
            email: adminEmail,
            phone: "9876543210",
            password: hashedPassword,
            role: "admin",
            status: "Active"
        });

        console.log("Admin created successfully!");
        console.log("Email: admin@smartsociety.com");
        console.log("Password: Admin@123");
        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

createAdmin();