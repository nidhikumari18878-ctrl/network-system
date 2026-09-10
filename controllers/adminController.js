
const User = require("../models/User");
const Visitor = require("../models/visitor");
const Complaint = require("../models/complaint");
const Notice = require("../models/notice");
const Maintenance = require("../models/maintances");

// ==================================================
// ADMIN DASHBOARD
// ==================================================

const dashboard = async (req, res) => {
    try {
        // ------------------------------------------
        // Total Active Residents
        // ------------------------------------------

        const totalResidents = await User.countDocuments({
            role: "resident",
            status: "Active"
        });

        // ------------------------------------------
        // Today's Date Range
        // ------------------------------------------

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // ------------------------------------------
        // Today's Visitors Count
        // ------------------------------------------

        const todayVisitors = await Visitor.countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        // ------------------------------------------
        // Pending Complaints
        // ------------------------------------------

        const pendingComplaints = await Complaint.countDocuments({
            status: "Pending"
        });

        // ------------------------------------------
        // Recent Complaints
        // ------------------------------------------

        const recentComplaints = await Complaint.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // ------------------------------------------
        // Today's Visitors
        // ------------------------------------------

        const visitors = await Visitor.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // ------------------------------------------
        // Latest Published Notices
        // ------------------------------------------

        const notices = await Notice.find({
            status: "Published"
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // ------------------------------------------
        // Monthly Visitor Analytics
        // ------------------------------------------

        const currentYear = new Date().getFullYear();

        const yearStart = new Date(currentYear, 0, 1);
        const nextYearStart = new Date(currentYear + 1, 0, 1);

        const monthlyData = await Visitor.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: yearStart,
                        $lt: nextYearStart
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.month": 1
                }
            }
        ]);

        // Always return 12 months
        const monthlyVisitors = Array(12).fill(0);

        monthlyData.forEach((item) => {
            const monthIndex = item._id.month - 1;

            if (monthIndex >= 0 && monthIndex < 12) {
                monthlyVisitors[monthIndex] = item.total;
            }
        });

        // ------------------------------------------
        // Maintenance - Total Collected
        // ------------------------------------------

        const totalCollectedResult = await Maintenance.aggregate([
            {
                $match: {
                    status: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $ifNull: ["$amount", 0]
                        }
                    }
                }
            }
        ]);

        const totalCollected =
            totalCollectedResult.length > 0
                ? totalCollectedResult[0].total
                : 0;

        // ------------------------------------------
        // Maintenance - Pending Amount
        // ------------------------------------------

        const pendingAmountResult = await Maintenance.aggregate([
            {
                $match: {
                    status: {
                        $in: ["Pending", "Overdue"]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $ifNull: ["$amount", 0]
                        }
                    }
                }
            }
        ]);

        const pendingAmount =
            pendingAmountResult.length > 0
                ? pendingAmountResult[0].total
                : 0;

        // ------------------------------------------
        // Render Dashboard
        // ------------------------------------------

        return res.render("admin/dashboard", {
            totalResidents,
            todayVisitors,
            pendingComplaints,
            recentComplaints,
            visitors,
            notices,
            monthlyVisitors,
            totalCollected,
            pendingAmount
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        return res.status(500).send(
            "Unable to load admin dashboard."
        );
    }
};

// ==================================================
// EXPORT CONTROLLER
// ==================================================

exports.dashboard = dashboard;
