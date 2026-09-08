const express = require("express");
const router = express.Router();
const { requireLogin, requireRole } = require("../middleware/auth");
const maintenanceController = require("../controllers/maintenance");

// All maintenance routes require admin role
router.use(requireLogin);
router.use(requireRole("admin"));

router.get("/", maintenanceController.getMaintenance);
router.get("/add", maintenanceController.showAddMaintenance);
router.post("/add", maintenanceController.addMaintenance);
router.get("/view/:id", maintenanceController.viewMaintenance);
router.get("/edit/:id", maintenanceController.showEditMaintenance);
router.post("/update/:id", maintenanceController.updateMaintenance);
router.post("/delete/:id", maintenanceController.deleteMaintenance);

module.exports = router;