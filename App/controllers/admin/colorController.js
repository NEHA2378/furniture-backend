const colorModal = require("../../model/colorModel")


// let colorController = {
//     createColor: async (req, res) => {

//         const dataSave = req.body
//         // console.log(dataSave);

//         await colorModal(dataSave).save()

//             .then((result) => {
//                 res.send(
//                     {
//                         _status: true,
//                         _message: "Color Added New",
//                         _data: result
//                     }
//                 )
//             })
//             .catch((error) => {
//                 res.send(
//                     {
//                         _status: false,
//                         _message: "Something Went Wrong",
//                         _error : error,
//                         _data: ""
//                     }
//                 )
//             })


//     },
//     viewColor: async (req, res) => {
//         var records = await colorModal.find()
//         res.send(
//             {
//                 _status: true,
//                 _message: "Color Viewed New",
//                 _recorde: records
//             }
//         )
//     },
//     deleteColor: (req, res) => {
//         res.send(
//             {
//                 _status: true,
//                 _message: "Color Deleted New"
//             }
//         )
//     },
//     updateColor: (req, res) => {
//         res.send(
//             {
//                 _status: true,
//                 _message: "Color Updated New"
//             }
//         )
//     }

// }

// module.exports = { colorController }

let createColor = async (req, res) => {
    let bodyData = req.body;

    try {
        let { colorName, colorCode, colorOrder } = bodyData;

        // Normalize (avoid Red vs red issue)
        colorName = colorName.toLowerCase().trim();
        colorCode = colorCode.toLowerCase().trim();

        // Check duplicate
        let existingColor = await colorModal.findOne({
            $or: [
                { colorName: colorName },
                { colorCode: colorCode }
            ],
            isDeleted: false
        });

        if (existingColor) {
            return res.send({
                _status: false,
                _message: "Color already exists"
            });
        }

        if (!colorName || !colorCode || !colorOrder) {
            return res.send({
                _status: false,
                _message: "Please fill all the required fields"
            })
        }

        // Save normalized values
        let color = new colorModal({
            ...bodyData,
            colorName,
            colorCode
        });

        let colorRes = await color.save();

        res.send({
            _status: true,
            _message: "New Color Added",
            colorRes
        });

    }
    catch (dbError) {
        res.send({
            _status: false,
            _message: dbError.message,
            dbError
        });
    }
}

let viewColor = async (req, res) => {

    let filter = {
        deletedAt: null
    }

    // filter.colorOrder = {$gt: 3}

    if(req.body != undefined){
        if(req.body.name != undefined && req.body.name != ''){
            filter.colorName = req.body.name
        }

        if(req.body.code != undefined && req.body.code != ''){
            filter.colorCode = req.body.code
        }
    }

    let totalRecords = await colorModal.find(filter).countDocuments()
    

    var limit = 2;
    var skip = 0;
    var page = 1;

    if(req.body != undefined){
        if(req.body.page != undefined && req.body.page != ''){
            page = req.body.page;
            skip = (page-1)*limit
        }
    }

    var paginate = {
        totalRecords : totalRecords,
        currentPage : page,
        totalPages : Math.ceil(totalRecords/limit)
    }

    let data = await colorModal.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({
        colorOrder: 'asc',
        _id: 'desc'
    });
    res.send(
        {
            _status: true,
            _message: "Color Viewed New",
            _paginate: paginate,
            data
        }
    )
}

let deleteColor = async (req, res) => {
    let { id } = req.params
    let deleteStatus = await colorModal.updateOne(
        { _id: id },
        {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }
    )
    res.send(
        {
            _status: true,
            _message: "Color Deleted New",
            deleteStatus
        }
    )
}

let colorMultiDelete = async (req, res) => {
    let { ids } = req.body
    let deleteStatus = await colorModal.updateMany(
        { _id: ids },
        {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }
    )
    res.send(
        {
            _status: true,
            _message: "Color Deleted New",
            deleteStatus
        }
    )
}

let updateColor = async (req, res) => {
    let { id } = req.params
    let { colorName, colorOrder, colorCode } = req.body

    try {

        let existingColor = await colorModal.findOne({
            $or: [
                { colorName: colorName },
                { colorCode: colorCode }
            ],
            _id: { $ne: id },
            isDeleted: false
        });

        if (existingColor) {
            return res.send({
                _status: false,
                _message: "Color already exists"
            });
        }

        // Basic validation
        if (!colorName || !colorOrder || !colorCode) {
            return res.send({
                _status: false,
                _message: "All fields are required"
            })
        }

        // Update with mongoose (IMPORTANT: runValidators)
        let updateRes = await colorModal.updateOne(
            { _id: id },
            {
                $set: {
                    colorName,
                    colorOrder,
                    colorCode
                }
            },
            { runValidators: true }   
        )

        res.send({
            _status: true,
            _message: "Color Updated Successfully",
            updateRes
        })

        console.log(req.body)

    } catch (error) {

        //This will catch min/max errors from schema
        res.send({
            _status: false,
            _message: error.message
        })
    }
}

let changeColorStatus = async (req, res) => {
    let { ids } = req.body

    let colorStatus = await colorModal.updateMany(
        { _id: ids },
        [
            {
                $set: {
                    colorStatus: {
                        $not: '$colorStatus'
                    }
                }
            }
        ],
        {
            updatePipeline: true
        }
    )
    res.send(
        {
            _status: true,
            _message: "Color Status Changed",

        }
    )
}

let getColorDetails = async (req, res) => {

    let {id} = req.params

    let data = await colorModal.findOne({_id : id})
    res.send(
        {
            _status: true,
            _message: "Color Viewed New",
            data
        }
    )
}

module.exports = { createColor, viewColor, deleteColor, updateColor, colorMultiDelete, changeColorStatus, getColorDetails }