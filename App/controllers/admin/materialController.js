const materialModal = require("../../model/materialModel")


let createMaterial = async (req, res) => {
    let bodyData = req.body;
    try {
        let { materialName, materialOrder } = bodyData

        // Normalize
        materialName = materialName.toLowerCase().trim();

        // Check duplicate
        let existingMaterial = await materialModal.findOne({
            $or: [
                { materialName: materialName },
            ],
            isDeleted: false
        });

        if (existingMaterial) {
            return res.send({
                _status: false,
                _message: "Material already exists"
            });
        }

        if (!materialName || !materialOrder) {
            return res.send({
                _status: false,
                _message: "Please fill all the required fields"
            })
        }

        let material = new materialModal({
            ...bodyData,
            materialName,
            materialOrder
        });

        let materialRes = await material.save()


        res.send(
            {
                _status: true,
                _message: " New Material Added",
                materialRes
            }
        )
    }
    catch (dbError) {

        res.send(
            {
                _status: false,
                _message: dbError.message,
                dbError
            }
        )
    }


}

let viewMaterial = async (req, res) => {

    let filter = {
        isDeleted: false
    }

    let data = await materialModal.find(filter)
    res.send(
        {
            _status: true,
            _message: "Material Viewed New",
            data
        }
    )
}

let deleteMaterial = async (req, res) => {
    let { id } = req.params
    let deleteStatus = await materialModal.updateOne(
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
            _message: "Material Deleted New",
            deleteStatus
        }
    )
}

let materialMultiDelete = async (req, res) => {
    let { ids } = req.body
    let deleteStatus = await materialModal.updateMany(
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
            _message: "Material Deleted New",
            deleteStatus
        }
    )
}

let updateMaterial = async (req, res) => {
    let { id } = req.params
    let { materialName, materialOrder } = req.body

    try {

        // Check duplicate
        let existingMaterial = await materialModal.findOne({
            materialName,
            _id: { $ne: id },     //ignore current record
            isDeleted: false
        })

        if (existingMaterial) {
            return res.send({
                _status: false,
                _message: "Material already exists"
            });
        }

        // Basic validation
        if (!materialName || !materialOrder) {
            return res.send({
                _status: false,
                _message: "All fields are required"
            })
        }

        // Update with mongoose (IMPORTANT: runValidators)
        let updateRes = await materialModal.updateOne(
            { _id: id },
            {
                $set: {
                    materialName,
                    materialOrder
                }
            },
            { runValidators: true }   // ⭐ THIS IS IMPORTANT
        )

        res.send({
            _status: true,
            _message: "Material Updated Successfully",
            updateRes
        })

    } catch (error) {

        //This will catch min/max errors from schema
        res.send({
            _status: false,
            _message: error.message
        })
    }
}

let changeMaterialStatus = async (req, res) => {
    let { ids } = req.body

    let materialStatus = await materialModal.updateMany(
        { _id: ids },
        [
            {
                $set: {
                    materialStatus: {
                        $not: '$materialStatus'
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
            _message: "Material Status Changed",

        }
    )
}

let getMaterialDetails = async (req, res) => {

    let { id } = req.params

    let data = await materialModal.findOne({ _id: id })
    res.send(
        {
            _status: true,
            _message: "Material Viewed New",
            data
        }
    )
}

module.exports = { createMaterial, viewMaterial, deleteMaterial, updateMaterial, materialMultiDelete, changeMaterialStatus, getMaterialDetails }