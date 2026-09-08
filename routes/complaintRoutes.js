const express = require("express");
const router = express.Router();
const { requireLogin, requireRole } = require("../middleware/auth");
const complaintController = require("../controllers/complain");

// All complaint routes require admin role
router.use(requireLogin);
router.use(requireRole("admin"));

router.get("/", complaintController.getComplaints);
router.get("/view/:id", complaintController.viewComplaint);
router.post("/update/:id", complaintController.updateComplaint);
router.post("/delete/:id", complaintController.deleteComplaint);

module.exports = router;