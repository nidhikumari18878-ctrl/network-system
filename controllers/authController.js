const User = require("../models/User");
const bcrypt = require("bcrypt");

// ==========================
// GET REGISTER PAGE
// ==========================

exports.getRegister = (req, res) => {
    res.render("auth/register");
};


// ==========================
// REGISTER USER
// ==========================

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            flat,
            role,
            password,
            confirmPassword
        } = req.body;


        // --------------------------
        // Check required fields
        // --------------------------

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {
            return res.send("Please fill all required fields");
        }


        // --------------------------
        // Check password
        // --------------------------

        if (password !== confirmPassword) {
            return res.send("Passwords do not match");
        }


        // --------------------------
        // Check existing email
        // --------------------------

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.send("Email already registered");
        }


        // --------------------------
        // Hash password
        // --------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // --------------------------
        // Role
        // --------------------------

        const userRole = role || "resident";


        // --------------------------
        // Create User
        // --------------------------

        const user = await User.create({

            name,

            email: email.toLowerCase(),

            phone,

            flat,

            role: userRole,

            password: hashedPassword

        });


        console.log("User Registered:", user._id);


        // --------------------------
        // Redirect Login
        // --------------------------

        res.redirect("/login");


    } catch (error) {

        console.log("Registration Error:", error);

        res.status(500).send("Server Error");

    }

};
// ==========================
// GET LOGIN PAGE
// ==========================

exports.getLogin = (req, res) => {
    res.render("auth/login");
};


// ==========================
// LOGIN USER
// ==========================

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.send("Please enter email and password");
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.send("Invalid email or password");
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.send("Invalid email or password");
        }

        console.log("Login successful:", user.email);
        // Create Session

req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
};


console.log("Session Created:", req.session.user);
        // Temporary redirect based on role
        if (user.role === "resident") {
            return res.redirect("/resident/dashboard");
        }

        if (user.role === "security") {
            return res.redirect("/security/dashboard");
        }

        return res.send("Invalid user role");

    } catch (error) {

        console.log("Login Error:", error);

        res.status(500).send("Server Error");
    }
};
exports.logout = (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Logout failed");
        }

        res.redirect("/login");
    });
};