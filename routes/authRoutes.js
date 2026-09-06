const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/authController");

const {
    requireLogin,
    requireRole
}=require("../middleware/auth")
// Register Page

router.get(
    "/register",
    authController.getRegister
);


// Register User

router.post(
    "/register",
    authController.register
);
// login Page

router.get(
    "/register",
    authController.getLogin
);


// Register User

router.post(
    "/register",
    authController.login
);
router.get(
    "/logout",
    authController.logout
);
router.get("/residents",requireRole("admin"),ResidentController.getResidents);

module.exports = router;