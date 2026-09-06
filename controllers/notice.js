const Notice = require("../models/notice");

// =============================
// List Notices
// =============================
exports.getNotices = async (req, res) => {

    try {

        const search = req.query.search || "";

        const query = {};

        if (search) {

            query.title = {
                $regex: search,
                $options: "i"
            };

        }

        const notices = await Notice.find(query)
            .sort({ createdAt: -1 });

        res.render("admin/notice", {
            notices,
            search
        });

    } catch (err) {

        console.log(err);
        res.status(500).send(err.message);

    }

};

// =============================
// Show Add Notice Page
// =============================
exports.showAddNotice = (req, res) => {

    res.render("admin/addNotice");

};

// =============================
// Add Notice
// =============================
exports.addNotice = async (req, res) => {

    try {

        const {
            title,
            description,
            postedBy,
            status
        } = req.body;

        await Notice.create({

            title,

            description,

            postedBy,

            status

        });

        res.redirect("/admin/notice");

    } catch (err) {

        console.log(err);
        res.status(500).send(err.message);

    }

};

// =============================
// View Notice
// =============================
exports.viewNotice = async (req, res) => {

    try {

        const notice = await Notice.findById(req.params.id);

        if (!notice) {

            return res.status(404).send("Notice not found");

        }

        res.render("admin/viewNotice", {
            notice
        });

    } catch (err) {

        console.log(err);
        res.status(500).send(err.message);

    }

};

// =============================
// Show Edit Page
// =============================
exports.showEditNotice = async (req, res) => {

    try {

        const notice = await Notice.findById(req.params.id);

        if (!notice) {

            return res.status(404).send("Notice not found");

        }

        res.render("admin/editNotice", {
            notice
        });

    } catch (err) {

        console.log(err);
        res.status(500).send(err.message);

    }

};

// =============================
// Update Notice
// =============================
exports.updateNotice = async (req, res) => {

    try {

        const {
            title,
            description,
            postedBy,
            status
        } = req.body;

        await Notice.findByIdAndUpdate(

            req.params.id,

            {
                title,
                description,
                postedBy,
                status
            }

        );

        res.redirect("/admin/notice");

    } catch (err) {

        console.log(err);
        res.status(500).send(err.message);

    }

};

// =============================
// Delete Notice
// =============================
exports.deleteNotice = async (req, res) => {

    try {

        await Notice.findByIdAndDelete(req.params.id);

        res.redirect("/admin/notice");

    } catch (err) {

        console.log(err);
        res.status(500).send(err.message);

    }

};