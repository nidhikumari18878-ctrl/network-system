const express = require("express");

const router = express.Router();
const adminController =
    require("../controllers/adminController");

const {
    requireRole
} = require("../middleware/auth");

const residentController = require("../controllers/residentControllers");

const upload = require("../config/multer");


// ===============================
// Residents
// ===============================

// Residents List
router.get(
    "/dashboard",
    requireRole("admin"),
    adminController.getDashboard
);
router.get(
    "/residents",
    residentController.getResidents
);


// Add Resident Page
router.get(
    "/residents/add",
    residentController.getAddResident
);


// Add Resident
router.post(
    "/residents/add",
    upload.single("profileImage"),
    residentController.addResident
);


// View Resident
router.get(
    "/residents/view/:id",
    residentController.viewResident
);


// Edit Resident Page
router.get(
    "/residents/edit/:id",
    residentController.getEditResident
);


// Update Resident
router.post(
    "/residents/update/:id",
    residentController.updateResident
);


// Delete Resident
router.post(
    "/residents/delete/:id",
    residentController.deleteResident
);


module.exports = router;