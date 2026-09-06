const Visitor = require("../models/visitor");

// ==========================
// Get All Visitors
// ==========================

exports.getVisitors = async (req, res) => {

    try {

        const visitors = await Visitor.find()
            .sort({ createdAt: -1 });

        res.render("admin/visitors", {
            visitors
        });

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

// ==========================
// View Visitor
// ==========================

exports.viewVisitor = async (req, res) => {

    try {

        const visitor = await Visitor.findById(req.params.id);

        if (!visitor) {
            return res.status(404).send("Visitor not found");
        }

        res.render("admin/viewVisitor", {
            visitor
        });

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

// ==========================
// Approve Visitor
// ==========================

exports.approveVisitor = async (req, res) => {

    try {

        await Visitor.findByIdAndUpdate(

            req.params.id,

            {
                status: "Entered",
                entryTime: new Date()
            }

        );

        res.redirect("/admin/visitors");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

// ==========================
// Exit Visitor
// ==========================

exports.exitVisitor = async (req, res) => {

    try {

        await Visitor.findByIdAndUpdate(

            req.params.id,

            {
                status: "Exited",
                exitTime: new Date()
            }

        );

        res.redirect("/admin/visitors");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

// ==========================
// Delete Visitor
// ==========================

exports.deleteVisitor = async (req, res) => {

    try {

        await Visitor.findByIdAndDelete(req.params.id);

        res.redirect("/admin/visitors");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};