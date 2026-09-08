const User = require("../models/User");
const Complaint = require("../models/complaint");
const Maintenance = require("../models/maintances");
const Notice = require("../models/notice");
const Visitor = require("../models/visitor");
const bcrypt = require("bcrypt");

// =============================
// RESIDENT DASHBOARD
// =============================
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get resident details
        const resident = await User.findById(userId);
        
        if (!resident) {
            return res.status(404).send("Resident not found");
        }

        // Get complaints
        const complaints = await Complaint.find({ resident: resident.name })
            .sort({ createdAt: -1 })
            .limit(5);

        // Get maintenance records
        const maintenance = await Maintenance.find({ residentName: resident.name })
            .sort({ createdAt: -1 })
            .limit(5);

        // Get notices
        const notices = await Notice.find({ status: "Published" })
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent visitors
        const visitors = await Visitor.find({ residentName: resident.name })
            .sort({ createdAt: -1 })
            .limit(5);

        // Statistics
        const totalComplaints = await Complaint.countDocuments({ resident: resident.name });
        const pendingComplaints = await Complaint.countDocuments({ 
            resident: resident.name, 
            status: "Pending" 
        });
        const totalMaintenance = await Maintenance.countDocuments({ residentName: resident.name });
        const pendingMaintenance = await Maintenance.countDocuments({ 
            residentName: resident.name, 
            status: { $in: ["Pending", "Overdue"] } 
        });

        res.render("resident/dashboard", {
            resident,
            complaints,
            maintenance,
            notices,
            visitors,
            totalComplaints,
            pendingComplaints,
            totalMaintenance,
            pendingMaintenance
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).send("Server Error");
    }
};

// =============================
// PROFILE
// =============================
exports.getProfile = async (req, res) => {
    try {
        const resident = await User.findById(req.session.user.id);
        
        if (!resident) {
            return res.status(404).send("Resident not found");
        }

        res.render("resident/profile", { resident });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, occupation, members } = req.body;
        const userId = req.session.user.id;

        await User.findByIdAndUpdate(userId, {
            name,
            email,
            phone,
            occupation,
            members
        });

        // Update session
        req.session.user.name = name;
        req.session.user.email = email;

        res.redirect("/resident/profile?success=Profile updated successfully");
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).send("Server Error");
    }
};

// =============================
// COMPLAINTS
// =============================
exports.getComplaints = async (req, res) => {
    try {
        const resident = await User.findById(req.session.user.id);
        const complaints = await Complaint.find({ resident: resident.name })
            .sort({ createdAt: -1 });

        res.render("resident/complaints", { complaints, resident });
    } catch (error) {
        console.error("Complaints Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.getAddComplaint = async (req, res) => {
    try {
        const resident = await User.findById(req.session.user.id);
        res.render("resident/addComplaint", { resident });
    } catch (error) {
        console.error("Add Complaint Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.addComplaint = async (req, res) => {
    try {
        const { category, description } = req.body;
        const resident = await User.findById(req.session.user.id);

        if (!category || !description) {
            return res.status(400).send("Category and description are required");
        }

        await Complaint.create({
            resident: resident.name,
            category,
            description,
            status: "Pending"
        });

        res.redirect("/resident/complaints?success=Complaint submitted successfully");
    } catch (error) {
        console.error("Add Complaint Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.viewComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        
        if (!complaint) {
            return res.status(404).send("Complaint not found");
        }

        const resident = await User.findById(req.session.user.id);
        
        // Check if complaint belongs to this resident
        if (complaint.resident !== resident.name) {
            return res.status(403).send("Access Denied");
        }

        res.render("resident/viewComplaint", { complaint, resident });
    } catch (error) {
        console.error("View Complaint Error:", error);
        res.status(500).send("Server Error");
    }
};

// =============================
// MAINTENANCE
// =============================
exports.getMaintenance = async (req, res) => {
    try {
        const resident = await User.findById(req.session.user.id);
        const records = await Maintenance.find({ residentName: resident.name })
            .sort({ createdAt: -1 });

        res.render("resident/maintenance", { records, resident });
    } catch (error) {
        console.error("Maintenance Error:", error);
        res.status(500).send("Server Error");
    }
};

// =============================
// NOTICES
// =============================
exports.getNotices = async (req, res) => {
    try {
        const resident = await User.findById(req.session.user.id);
        const notices = await Notice.find({ status: "Published" })
            .sort({ createdAt: -1 });

        res.render("resident/notices", { notices, resident });
    } catch (error) {
        console.error("Notices Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.viewNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        
        if (!notice) {
            return res.status(404).send("Notice not found");
        }

        const resident = await User.findById(req.session.user.id);
        res.render("resident/viewNotice", { notice, resident });
    } catch (error) {
        console.error("View Notice Error:", error);
        res.status(500).send("Server Error");
    }
};