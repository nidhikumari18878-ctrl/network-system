const express = require("express");

const router = express.Router();

const visitorController = require("../controllers/visitor");

// List Visitors
router.get(
    "/",
    visitorController.getVisitors
);

// View Visitor
router.get(
    "/view/:id",
    visitorController.viewVisitor
);

// Approve Visitor
router.post(
    "/approve/:id",
    visitorController.approveVisitor
);

// Exit Visitor
router.post(
    "/exit/:id",
    visitorController.exitVisitor
);

// Delete Visitor
router.post(
    "/delete/:id",
    visitorController.deleteVisitor
);

module.exports = router;