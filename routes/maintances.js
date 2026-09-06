const express = require("express");

const router = express.Router();

const controller = require("../controllers/maintenance");

router.get("/",controller.getMaintenance);

router.get("/add",controller.showAddMaintenance);

router.post("/add",controller.addMaintenance);

router.get("/view/:id",controller.viewMaintenance);

router.get("/edit/:id",controller.showEditMaintenance);

router.post("/update/:id",controller.updateMaintenance);

router.post("/delete/:id",controller.deleteMaintenance);

module.exports=router;