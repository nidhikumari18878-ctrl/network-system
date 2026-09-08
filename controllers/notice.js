const Notice = require("../models/notice");

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
        console.error("Get Notices Error:", err);
        res.status(500).send(err.message);
    }
};

exports.showAddNotice = (req, res) => {
    res.render("admin/addNotice");
};

exports.addNotice = async (req, res) => {
    try {
        const {
            title,
            description,
            postedBy,
            status
        } = req.body;

        if (!title || !description) {
            return res.status(400).send(
                "Title and description are required"
            );
        }

        await Notice.create({
            title,
            description,
            postedBy: postedBy || "Admin",
            status: status || "Draft",
            published: status === "Published"
        });

        res.redirect("/admin/notices");

    } catch (err) {
        console.error("Add Notice Error:", err);
        res.status(500).send(err.message);
    }
};

exports.viewNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).send(
                "Notice not found"
            );
        }

        res.render("admin/viewNotice", {
            notice
        });

    } catch (err) {
        console.error("View Notice Error:", err);
        res.status(500).send(err.message);
    }
};

exports.showEditNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).send(
                "Notice not found"
            );
        }

        res.render("admin/editNotice", {
            notice
        });

    } catch (err) {
        console.error("Edit Notice Error:", err);
        res.status(500).send(err.message);
    }
};

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
                postedBy: postedBy || "Admin",
                status,
                published: status === "Published"
            },
            { runValidators: true }
        );

        res.redirect("/admin/notices");

    } catch (err) {
        console.error("Update Notice Error:", err);
        res.status(500).send(err.message);
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);

        res.redirect("/admin/notices");

    } catch (err) {
        console.error("Delete Notice Error:", err);
        res.status(500).send(err.message);
    }
};