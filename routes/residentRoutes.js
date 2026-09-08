const express = require("express");
const router = express.Router();
const { requireLogin, requireRole } = require("../middleware/auth");
const residentController = require("../controllers/residentController");

// Resident Dashboard
router.get("/dashboard", requireLogin, requireRole("resident"), residentController.getDashboard);

// Profile Management
router.get("/profile", requireLogin, requireRole("resident"), residentController.getProfile);
router.post("/profile/update", requireLogin, requireRole("resident"), residentController.updateProfile);

// Complaints
router.get("/complaints", requireLogin, requireRole("resident"), residentController.getComplaints);
router.get("/complaints/add", requireLogin, requireRole("resident"), residentController.getAddComplaint);
router.post("/complaints/add", requireLogin, requireRole("resident"), residentController.addComplaint);
router.get("/complaints/view/:id", requireLogin, requireRole("resident"), residentController.viewComplaint);

// Maintenance
router.get("/maintenance", requireLogin, requireRole("resident"), residentController.getMaintenance);

// Notices
router.get("/notices", requireLogin, requireRole("resident"), residentController.getNotices);
router.get("/notices/view/:id", requireLogin, requireRole("resident"), residentController.viewNotice);

module.exports = router;