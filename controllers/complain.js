const Complaint = require("../models/Complaint");

// =============================
// Get All Complaints
// =============================
exports.getComplaints = async (req, res) => {
    try {

        const complaints = await Complaint.find()
            .sort({ createdAt: -1 });

        res.render("admin/complaints", {
            complaints
        });

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }
};

// =============================
// View Single Complaint
// =============================
exports.viewComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).send("Complaint not found");
        }

        res.render("admin/viewComplaint", {
            complaint
        });

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

// =============================
// Update Complaint Status
// =============================
exports.updateComplaint = async (req, res) => {

    try {

        const { status } = req.body;

        await Complaint.findByIdAndUpdate(

            req.params.id,

            {
                status
            }

        );

        res.redirect("/admin/complaints");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

// =============================
// Delete Complaint
// =============================
exports.deleteComplaint = async (req, res) => {

    try {

        await Complaint.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/admin/complaints");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};