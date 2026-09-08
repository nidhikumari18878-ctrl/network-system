
const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

// ==========================
// REGISTER
// ==========================

// Register page
router.get(
    "/register",
    authController.getRegister
);

// Register user
router.post(
    "/register",
    authController.register
);


// ==========================
// LOGIN
// ==========================

// Login page
router.get(
    "/login",
    authController.getLogin
);

// Login user
router.post(
    "/login",
    authController.login
);


// ==========================
// LOGOUT
// ==========================

router.get(
    "/logout",
    authController.logout
);


// ==========================
// EXPORT
// ==========================

module.exports = router;

