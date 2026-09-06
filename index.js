const express = require("express");

const path = require("path");
require("dotenv").config();

const app = express();
const dns=require("dns");
dns.setServers(["8.8.8.8","1.1.1.1"]);



const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ========================
// Middlewares
// ========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const expressSession = require("express-session");
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
}));
app.use(express.static(path.join(__dirname, "public")));


// ========================
// Routes
// ========================
const authRoutes=require("./routes/authRoutes");
app.use("/",authRoutes)
const adminRoutes = require("./routes/adminRoutes");

app.use("/admin", adminRoutes);

app.use((req, res) => {

    res.status(404).send("404 Page Not Found");

});

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Server Running on http://localhost:${PORT}`);

});
