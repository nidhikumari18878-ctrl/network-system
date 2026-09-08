const express = require("express");
const router = express.Router();

const { requireLogin, requireRole } = require("../middleware/auth");
const securityController = require("../controllers/securityController");

router.use(requireLogin);
router.use(requireRole("security"));

router.get("/dashboard", securityController.getDashboard);

router.get("/visitors", securityController.getVisitors);
router.get("/visitors/add", securityController.getAddVisitor);
router.post("/visitors/add", securityController.addVisitor);

router.get("/visitors/view/:id", securityController.viewVisitor);
router.post("/visitors/approve/:id", securityController.approveVisitor);
router.post("/visitors/exit/:id", securityController.exitVisitor);

router.get("/complaints", securityController.getComplaints);
router.get("/notices", securityController.getNotices);

module.exports = router;