require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");

const createAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await User.findOne({
            email: "admin@society.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        await User.create({
            name: "Society Admin",
            email: "admin@society.com",
            phone: "9999999999",
            password: hashedPassword,
            role: "admin",
            status: "Active"
        });

        console.log("Admin created successfully");

        process.exit();

    } catch (error) {

        console.log(error);
        process.exit(1);

    }
};

createAdmin();