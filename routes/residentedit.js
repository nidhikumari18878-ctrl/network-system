const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const residentController = require("../controllers/residentcontrollers");

// Open Edit Page
router.get(
    "/edit/:id",
    residentController.editResident
);

// Update Resident
router.post(
    "/update/:id",
    upload.single("profileImage"),
    residentController.updateResident
);

module.exports = router;