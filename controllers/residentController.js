const User = require("../models/User");
const Complaint = require("../models/complaint");
const Maintenance = require("../models/maintances");
const Notice = require("../models/notice");
const Visitor = require("../models/visitor");
const bcrypt = require("bcrypt");
// ==================================================
// ADMIN - RESIDENT MANAGEMENT
// ==================================================

exports.getResidents = async (req, res) => {
    try {
        const residents = await User.find({
            role: "resident"
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.render("admin/dashboard", {
            residents
        });
    } catch (error) {
        console.error("Get Residents Error:", error);
        return res.status(500).send("Unable to load residents.");
    }
};


exports.getAddResident = (req, res) => {
    return res.render("admin/add");
};


exports.addResident = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            occupation,
            members
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send(
                "Name, email and password are required."
            );
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).send(
                "A user with this email already exists."
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const residentData = {
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            occupation,
            members,
            role: "resident",
            status: "Active"
        };

        if (req.file) {
            residentData.profileImage = req.file.filename;
        }

        await User.create(residentData);

        return res.redirect(
            "/admin/residents?success=Resident added successfully"
        );

    } catch (error) {
        console.error("Add Resident Error:", error);
        return res.status(500).send("Unable to add resident.");
    }
};


exports.viewResident = async (req, res) => {
    try {
        const resident = await User.findOne({
            _id: req.params.id,
            role: "resident"
        }).lean();

        if (!resident) {
            return res.status(404).send("Resident not found.");
        }

        return res.render("admin/edit", {
            resident,
            viewOnly: true
        });

    } catch (error) {
        console.error("View Resident Error:", error);
        return res.status(500).send("Unable to load resident.");
    }
};


exports.getEditResident = async (req, res) => {
    try {
        const resident = await User.findOne({
            _id: req.params.id,
            role: "resident"
        }).lean();

        if (!resident) {
            return res.status(404).send("Resident not found.");
        }

        return res.render("admin/edit", {
            resident
        });

    } catch (error) {
        console.error("Get Edit Resident Error:", error);
        return res.status(500).send("Unable to load resident.");
    }
};


exports.updateResident = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            occupation,
            members,
            status
        } = req.body;

        const updateData = {
            name,
            email: email ? email.toLowerCase() : email,
            phone,
            occupation,
            members,
            status
        };

        if (password && password.trim() !== "") {
            updateData.password =
                await bcrypt.hash(password, 10);
        }

        if (req.file) {
            updateData.profileImage = req.file.filename;
        }

        const resident = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "resident"
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!resident) {
            return res.status(404).send(
                "Resident not found."
            );
        }

        return res.redirect(
            "/admin/residents?success=Resident updated successfully"
        );

    } catch (error) {
        console.error("Update Resident Error:", error);
        return res.status(500).send(
            "Unable to update resident."
        );
    }
};


exports.deleteResident = async (req, res) => {
    try {
        const resident = await User.findOneAndDelete({
            _id: req.params.id,
            role: "resident"
        });

        if (!resident) {
            return res.status(404).send(
                "Resident not found."
            );
        }

        return res.redirect(
            "/admin/residents?success=Resident deleted successfully"
        );

    } catch (error) {
        console.error("Delete Resident Error:", error);
        return res.status(500).send(
            "Unable to delete resident."
        );
    }
};