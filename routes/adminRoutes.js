const express = require("express");

const router = express.Router();

const {
    requireLogin,
    requireRole
} = require("../middleware/auth");

const adminController =
    require("../controllers/adminController");

const residentController =
    require("../controllers/residentController");

const upload =
    require("../config/multer");

// All admin routes
router.use(requireLogin);
router.use(requireRole("admin"));

// Dashboard
router.get(
    "/dashboard",
    adminController.dashboard
);

// Residents
router.get(
    "/residents",
    residentController.getResidents
);

router.get(
    "/residents/add",
    residentController.getAddResident
);

router.post(
    "/residents/add",
    upload.single("profileImage"),
    residentController.addResident
);

router.get(
    "/residents/view/:id",
    residentController.viewResident
);

router.get(
    "/residents/edit/:id",
    residentController.getEditResident
);

router.post(
    "/residents/update/:id",
    residentController.updateResident
);

router.post(
    "/residents/delete/:id",
    residentController.deleteResident
);

module.exports = router;