const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET: Residents List
exports.getResidents = async (req, res) => {
    try {
        const residents = await User.find({ role: "resident" })
            .sort({ createdAt: -1 });

        res.render("admin/resident", {
            residents
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


// GET: Add Resident Page
exports.getAddResident = (req, res) => {
    res.render("admin/add");
};


// POST: Add Resident
exports.addResident = async (req, res) => {
    // console.log("========== ADD RESIDENT ==========");
    // console.log("content:", req.headers["content-type"]);

    // console.log("BODY:", req.body);

    // console.log("FILE:", req.file);

    // res.send("Request received");
    try {
      
        const {
            name,
            email,
            phone,
            password,
            confirmPassword,
            gender,
            occupation,
            block,
            flat,
            members
        } = req.body;

        // Password check
        if (password !== confirmPassword) {
            return res.send("Passwords do not match");
        }

        // Check existing email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("Email already registered");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        let profileImage="";
        if(req.file){
            profileImage="/uploads/"+ req.file.filename
        }

        // Create resident
        await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            gender,
            occupation,
            block,
            flat,
            members,
            role: "resident",
            status: "Active"
        });

        res.redirect("/admin/resident");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


// GET: View Resident
exports.viewResident = async (req, res) => {
    try {

        const resident = await User.findOne({
            _id: req.params.id,
            role: "resident"
        });

        if (!resident) {
            return res.status(404).send("Resident not found");
        }

        res.render("admin/viewresident", {
            resident
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


// GET: Edit Resident
exports.getEditResident = async (req, res) => {
    try {

        const resident = await User.findOne({
            _id: req.params.id,
            role: "resident"
        });

        if (!resident) {
            return res.status(404).send("Resident not found");
        }

        res.render("admin/edit", {
            resident
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


// POST: Update Resident
exports.updateResident = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            gender,
            occupation,
            block,
            flat,
            members,
            status
        } = req.body;

        await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "resident"
            },
            {
                name,
                email,
                phone,
                gender,
                occupation,
                block,
                flat,
                members,
                status
            }
        );

        res.redirect("/admin/resident");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


// POST: Delete Resident
exports.deleteResident = async (req, res) => {
    try {

        await User.findOneAndDelete({
            _id: req.params.id,
            role: "resident"
        });

        res.redirect("/admin/resident");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};