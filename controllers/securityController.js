const Visitor = require("../models/visitor");
const Complaint = require("../models/complaint");
const Notice = require("../models/notice");
const User = require("../models/User");

// =============================
// SECURITY DASHBOARD
// =============================
exports.getDashboard = async (req, res) => {
    try {
        // Today's visitors
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayVisitors = await Visitor.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 });

        const waitingVisitors = await Visitor.countDocuments({ status: "Waiting" });
        const totalVisitors = await Visitor.countDocuments();

        // Recent complaints
        const complaints = await Complaint.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // Published notices
        const notices = await Notice.find({ status: "Published" })
            .sort({ createdAt: -1 })
            .limit(5);

        res.render("security/dashboard", {
            todayVisitors,
            waitingVisitors,
            totalVisitors,
            complaints,
            notices
        });

    } catch (error) {
        console.error("Security Dashboard Error:", error);
        res.status(500).send("Server Error");
    }
};

// =============================
// VISITORS
// =============================
exports.getVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find()
            .sort({ createdAt: -1 });

        res.render("security/visitors", { visitors });
    } catch (error) {
        console.error("Visitors Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.getAddVisitor = async (req, res) => {
    try {
        const residents = await User.find({ role: "resident", status: "Active" });
        res.render("security/addVisitor", { residents });
    } catch (error) {
        console.error("Add Visitor Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.addVisitor = async (req, res) => {
    try {
        const { visitorName, phone, residentName, flatNumber, purpose } = req.body;

        if (!visitorName || !phone || !residentName || !flatNumber || !purpose) {
            return res.status(400).send("All fields are required");
        }

        await Visitor.create({
            visitorName,
            phone,
            residentName,
            flatNumber,
            purpose,
            status: "Waiting"
        });

        res.redirect("/security/visitors?success=Visitor added successfully");
    } catch (error) {
        console.error("Add Visitor Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.viewVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        
        if (!visitor) {
            return res.status(404).send("Visitor not found");
        }

        res.render("security/viewVisitor", { visitor });
    } catch (error) {
        console.error("View Visitor Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.approveVisitor = async (req, res) => {
    try {
        await Visitor.findByIdAndUpdate(req.params.id, {
            status: "Entered",
            entryTime: new Date()
        });

        res.redirect("/security/visitors?success=Visitor approved");
    } catch (error) {
        console.error("Approve Visitor Error:", error);
        res.status(500).send("Server Error");
    }
};

exports.exitVisitor = async (req, res) => {
    try {
        await Visitor.findByIdAndUpdate(req.params.id, {
            status: "Exited",
            exitTime: new Date()
        });

        res.redirect("/security/visitors?success=Visitor exited");
    } catch (error) {
        console.error("Exit Visitor Error:", error);
        res.status(500).send("Server Error");
    }
};

// =============================
// COMPLAINTS (View Only)
// =============================
exports.getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .sort({ createdAt: -1 });

        res.render("security/complaints", { complaints });
    } catch (error) {
        console.error("Complaints Error:", error);
        res.status(500).send("Server Error");
    }
};

// =============================
// NOTICES (View Only)
// =============================
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ status: "Published" })
            .sort({ createdAt: -1 });

        res.render("security/notices", { notices });
    } catch (error) {
        console.error("Notices Error:", error);
        res.status(500).send("Server Error");
    }
};