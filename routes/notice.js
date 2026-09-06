const express = require("express");

const router = express.Router();

const noticeController = require("../controllers/notice");

// List Notices
router.get("/", noticeController.getNotices);

// Add Notice
router.get("/add", noticeController.showAddNotice);
router.post("/add", noticeController.addNotice);

// View Notice
router.get("/view/:id", noticeController.viewNotice);

// Edit Notice
router.get("/edit/:id", noticeController.showEditNotice);
router.post("/update/:id", noticeController.updateNotice);

// Delete Notice
router.post("/delete/:id", noticeController.deleteNotice);

module.exports = router;