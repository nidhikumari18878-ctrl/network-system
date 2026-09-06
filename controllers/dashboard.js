const Resident = require("../models/resident");
const Complaint = require("../models/complaint");
const Visitor = require("../models/visitor");
const Notice = require("../models/notice");

exports.getDashboard = async (req, res) => {

    try {

        // Total Residents
        const totalResidents = await Resident.countDocuments();

        // Today's Visitors
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);

        tomorrow.setDate(today.getDate() + 1);

        const todayVisitors = await Visitor.countDocuments({

            createdAt: {
                $gte: today,
                $lt: tomorrow
            }

        });

        // Pending Complaints
        const pendingComplaints = await Complaint.countDocuments({

            status: "Pending"

        });

        // Latest 5 Complaints
        const recentComplaints = await Complaint.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // Today's Visitors List
        const visitors = await Visitor.find({

            createdAt: {
                $gte: today,
                $lt: tomorrow
            }

        }).sort({ createdAt: -1 });

        // Latest Notices
        const notices = await Notice.find()
            .sort({ createdAt: -1 })
            .limit(5);
             // Monthly Maintenance Collection
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthStart = new Date(currentYear, currentMonth, 1);

        const monthEnd = new Date(currentYear, currentMonth + 1, 1);

        const monthlyCollection = await Maintenance.aggregate([
            {
                $match: {
                    status: "Paid",
                    createdAt: {
                        $gte: monthStart,
                        $lt: monthEnd
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        res.render("admin/dashboard", {

            totalResidents,

            todayVisitors,

            pendingComplaints,

            recentComplaints,

            visitors,

            notices

        });

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};