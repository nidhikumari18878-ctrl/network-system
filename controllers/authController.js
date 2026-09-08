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
        const { name, email, phone, flat, password, confirmPassword, role } = req.body;

        // Check required fields
        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).send("Please fill all required fields");
        }

        // Check password
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long");
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check existing email
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).send("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user - prevent admin registration from public
        let userRole = "resident";
        if (role === "security") {
            userRole = "security";
        }
        // admin role is not allowed via public registration

        await User.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            flat: flat ? flat.trim() : "",
            role: userRole,
            password: hashedPassword,
            status: "Active"
        });

        console.log("User Registered successfully");
        return res.redirect("/login?success=Registration successful! Please login.");

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 11000) {
            return res.status(409).send("Email already registered");
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message).join(", ");
            return res.status(400).send(messages);
        }
        return res.status(500).send("Server Error");
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

        if (!email || !password) {
            return res.status(400).send("Please enter email and password");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        if (user.status === "Inactive") {
            return res.status(403).send("Your account is inactive. Please contact the administrator.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid email or password");
        }

        req.session.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        };

        console.log("Login successful:", user.email);

        if (user.role === "admin") {
            return res.redirect("/admin/dashboard");
        }
        if (user.role === "resident") {
            return res.redirect("/resident/dashboard");
        }
        if (user.role === "security") {
            return res.redirect("/security/dashboard");
        }

        req.session.destroy(() => {});
        return res.status(403).send("Invalid user role");

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).send("Server Error");
    }
};

// ==========================
// LOGOUT USER
// ==========================
exports.logout = (req, res) => {
    if (!req.session) {
        return res.redirect("/login");
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Logout Error:", error);
            return res.status(500).send("Logout failed");
        }
        res.clearCookie("connect.sid");
        return res.redirect("/login");
    });
};