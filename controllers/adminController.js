// const User = require("../models/User");

// exports.getDashboard = async (req, res) => {

//     try {

//         const totalResidents = await User.countDocuments({
//             role: "resident"
//         });

//         const totalSecurity = await User.countDocuments({
//             role: "security"
//         });

//         res.render("admin/dashboard", {
//             totalResidents,
//             totalSecurity
//         });

//     } catch (error) {

//         console.log("Dashboard Error:", error);

//         res.status(500).send("Server Error");

//     }
// };

const Resident = require("../models/Resident");
const Visitor = require("../models/Visitor");
const Complaint = require("../models/Complaint");
const Notice = require("../models/Notice");

const dashboard = async (req, res) => {
    try {

        // Total residents
        const totalResidents = await Resident.countDocuments({
            status: "active"
        });

        // Start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // End of today
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Today's visitors
        const todayVisitors = await Visitor.countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        // Pending complaints
        const pendingComplaints = await Complaint.countDocuments({
            status: "Pending"
        });

        // Recent complaints
        const recentComplaints = await Complaint
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Today's visitors list
        const visitors = await Visitor
            .find({
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Latest notices
        const notices = await Notice
            .find({
                published: true
            })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Monthly analytics
        const currentYear = new Date().getFullYear();

        const monthlyData = await Visitor.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
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

        // Create 12 months with 0 as default
        const monthlyVisitors = Array(12).fill(0);

        monthlyData.forEach(item => {
            monthlyVisitors[item._id.month - 1] = item.total;
        });

        res.render("admin/dashboard", {
            totalResidents,
            todayVisitors,
            pendingComplaints,
            recentComplaints,
            visitors,
            notices,
            monthlyVisitors
        });

    } catch (error) {

        console.error("Dashboard Error:", error);

        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    dashboard
};