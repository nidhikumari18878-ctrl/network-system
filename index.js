const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ========================
// Configuration
// ========================

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET || "change-this-session-secret";

// ========================
// Validate Environment
// ========================

if (!MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is not defined in .env");
    process.exit(1);
}

// ========================
// Middleware
// ========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ========================
// Routes
// ========================

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const residentRoutes = require("./routes/residentRoutes");
const securityRoutes = require("./routes/securityRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const visitorRoutes = require("./routes/visitorRoutes");

// Authentication routes
app.use("/", authRoutes);

// Admin routes
app.use("/admin", adminRoutes);
app.use("/admin/complaints", complaintRoutes);
app.use("/admin/maintenance", maintenanceRoutes);
app.use("/admin/notices", noticeRoutes);
app.use("/admin/visitors", visitorRoutes);

// Resident routes
app.use("/resident", residentRoutes);

// Security routes
app.use("/security", securityRoutes);

// Home route
app.get("/", (req, res) => {
    if (req.session && req.session.user) {
        const role = req.session.user.role;
        if (role === "admin") return res.redirect("/admin/dashboard");
        if (role === "resident") return res.redirect("/resident/dashboard");
        if (role === "security") return res.redirect("/security/dashboard");
    }
    res.render("auth/home");
});

// ========================
// 404 Handler
// ========================

app.use((req, res) => {
    res.status(404).render("error/404");
});

// ========================
// Global Error Handler
// ========================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).render("error/500", { error: err.message });
});

// ========================
// MongoDB + Server Startup
// ========================

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server Running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB Connection Failed:");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();

// ========================
// Graceful Shutdown
// ========================

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
});