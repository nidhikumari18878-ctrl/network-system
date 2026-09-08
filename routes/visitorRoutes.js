const express = require("express");
const router = express.Router();
const { requireLogin, requireRole } = require("../middleware/auth");
const visitorController = require("../controllers/visitor");

// All visitor routes require admin role
router.use(requireLogin);
router.use(requireRole("admin"));

router.get("/", visitorController.getVisitors);
router.get("/view/:id", visitorController.viewVisitor);
router.post("/approve/:id", visitorController.approveVisitor);
router.post("/exit/:id", visitorController.exitVisitor);
router.post("/delete/:id", visitorController.deleteVisitor);

module.exports = router;