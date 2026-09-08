const Maintenance = require("../models/maintances");

exports.getMaintenance = async (req, res) => {
    try {
        const search = req.query.search || "";
        const block = req.query.block || "";
        const status = req.query.status || "";

        const query = {};

        if (search) {
            query.residentName = {
                $regex: search,
                $options: "i"
            };
        }

        if (block) {
            query.block = block;
        }

        if (status) {
            query.status = status;
        }

        const records = await Maintenance.find(query)
            .sort({ createdAt: -1 });

        const totalCollected =
            await Maintenance.aggregate([
                {
                    $match: {
                        status: "Paid"
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

        const pendingAmount =
            await Maintenance.aggregate([
                {
                    $match: {
                        status: "Pending"
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

        const overdueAmount =
            await Maintenance.aggregate([
                {
                    $match: {
                        status: "Overdue"
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

        res.render("admin/maintainance", {
            records,
            totalCollected:
                totalCollected[0]?.total || 0,
            pendingAmount:
                pendingAmount[0]?.total || 0,
            overdueAmount:
                overdueAmount[0]?.total || 0
        });

    } catch (err) {
        console.error("Maintenance Error:", err);
        res.status(500).send(err.message);
    }
};

exports.showAddMaintenance = (req, res) => {
    res.render("admin/addMaintenance");
};

exports.addMaintenance = async (req, res) => {
    try {
        await Maintenance.create(req.body);

        res.redirect("/admin/maintenance");
    } catch (err) {
        console.error("Add Maintenance Error:", err);
        res.status(500).send(err.message);
    }
};

exports.viewMaintenance = async (req, res) => {
    try {
        const record = await Maintenance.findById(req.params.id);

        if (!record) {
            return res.status(404).send(
                "Maintenance record not found"
            );
        }

        res.render("admin/viewMaintenance", {
            record
        });

    } catch (err) {
        console.error("View Maintenance Error:", err);
        res.status(500).send(err.message);
    }
};

exports.showEditMaintenance = async (req, res) => {
    try {
        const record = await Maintenance.findById(req.params.id);

        if (!record) {
            return res.status(404).send(
                "Maintenance record not found"
            );
        }

        res.render("admin/editMaintenance", {
            record
        });

    } catch (err) {
        console.error("Edit Maintenance Error:", err);
        res.status(500).send(err.message);
    }
};

exports.updateMaintenance = async (req, res) => {
    try {
        await Maintenance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { runValidators: true }
        );

        res.redirect("/admin/maintenance");

    } catch (err) {
        console.error("Update Maintenance Error:", err);
        res.status(500).send(err.message);
    }
};

exports.deleteMaintenance = async (req, res) => {
    try {
        await Maintenance.findByIdAndDelete(req.params.id);

        res.redirect("/admin/maintenance");

    } catch (err) {
        console.error("Delete Maintenance Error:", err);
        res.status(500).send(err.message);
    }
};