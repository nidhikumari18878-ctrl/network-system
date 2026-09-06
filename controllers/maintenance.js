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

        const totalCollected = await Maintenance.aggregate([
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

        const pendingAmount = await Maintenance.aggregate([
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

        const overdueAmount = await Maintenance.aggregate([
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

        console.log(err);

    }

};
exports.addMaintenance = async (req,res)=>{

    await Maintenance.create(req.body);

    res.redirect("/admin/maintainance");

}
exports.viewMaintenance = async(req,res)=>{

    const record = await Maintenance.findById(req.params.id);

    res.render("admin/viewMaintenance",{

        record

    });

}
exports.showEditMaintenance = async(req,res)=>{

    const record = await Maintenance.findById(req.params.id);

    res.render("admin/editMaintenance",{

        record

    });

}
exports.updateMaintenance = async(req,res)=>{

    await Maintenance.findByIdAndUpdate(

        req.params.id,

        req.body

    );

    res.redirect("/admin/maintainance");

}
exports.deleteMaintenance = async(req,res)=>{

    await Maintenance.findByIdAndDelete(req.params.id);

    res.redirect("/admin/maintainance");

}