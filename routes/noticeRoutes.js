const express = require("express");
const router = express.Router();
const { requireLogin, requireRole } = require("../middleware/auth");
const noticeController = require("../controllers/notice");

// All notice routes require admin role
router.use(requireLogin);
router.use(requireRole("admin"));

router.get("/", noticeController.getNotices);
router.get("/add", noticeController.showAddNotice);
router.post("/add", noticeController.addNotice);
router.get("/view/:id", noticeController.viewNotice);
router.get("/edit/:id", noticeController.showEditNotice);
router.post("/update/:id", noticeController.updateNotice);
router.post("/delete/:id", noticeController.deleteNotice);

module.exports = router;