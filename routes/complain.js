const express = require("express");

const router = express.Router();

const complaintController = require("../controllers/complain");

// Complaint List
router.get(
    "/",
    complaintController.getComplaints
);

// View Complaint
router.get(
    "/view/:id",
    complaintController.viewComplaint
);

// Update Status
router.post(
    "/update/:id",
    complaintController.updateComplaint
);

// Delete Complaint
router.post(
    "/delete/:id",
    complaintController.deleteComplaint
);

module.exports = router;