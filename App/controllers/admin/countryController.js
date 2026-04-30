const countryModal = require("../../model/countryModel")


let createCountry = async (req, res) => {
    let bodyData = req.body;
    try {
        let { countryName, countryOrder } = bodyData


        // Normalize
        countryName = countryName.toLowerCase().trim();

        // Check duplicate
        let existingCountry = await countryModal.findOne({
            $or: [
                { countryName: countryName },
            ],
            isDeleted: false
        });

        if (existingCountry) {
            return res.send({
                _status: false,
                _message: "Country already exists"
            });
        }

        if (!countryName || !countryOrder) {
            return res.send({
                _status: false,
                _message: "Please fill all the required fields"
            })
        }
        let country = new countryModal({
            ...bodyData,
            countryName,
            countryOrder
        });

        let countryRes = await country.save()

        res.send(
            {
                _status: true,
                _message: " New Country Added",
                countryRes
            }
        )
    }
    catch (dbError) {
        res.send({
            _status: false,
            _message: dbError.message,
            dbError
        });
    }


}

let viewCountry = async (req, res) => {

    let filter = {
        isDeleted: false
    }

    let data = await countryModal.find(filter)
    res.send(
        {
            _status: true,
            _message: "Country Viewed New",
            data
        }
    )
}

let deleteCountry = async (req, res) => {
    let { id } = req.params
    let deleteStatus = await countryModal.updateOne(
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
            _message: "Country Deleted New",
            deleteStatus
        }
    )
}

let countryMultiDelete = async (req, res) => {
    let { ids } = req.body
    let deleteStatus = await countryModal.updateMany(
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
            _message: "Country Deleted New",
            deleteStatus
        }
    )
}

let updateCountry = async (req, res) => {
    let { id } = req.params
    let { countryName, countryOrder } = req.body

    try {

        // Check duplicate
        let existingCountry = await countryModal.findOne({
            $or: [
                { countryName: countryName },
            ],
            _id: { $ne: id },
            isDeleted: false
        });

        if (existingCountry) {
            return res.send({
                _status: false,
                _message: "Country already exists"
            });
        }

        // Basic validation
        if (!countryName || !countryOrder) {
            return res.send({
                _status: false,
                _message: "All fields are required"
            })
        }

        // Update with mongoose (IMPORTANT: runValidators)
        let updateRes = await countryModal.updateOne(
            { _id: id },
            {
                $set: {
                    countryName,
                    countryOrder
                }
            },
            { runValidators: true }
        )

        res.send({
            _status: true,
            _message: "Country Updated Successfully",
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

let changeCountryStatus = async (req, res) => {
    let { ids } = req.body

    let countryStatus = await countryModal.updateMany(
        { _id: ids },
        [
            {
                $set: {
                    countryStatus: {
                        $not: '$countryStatus'
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
            _message: "Country Status Changed",

        }
    )
}

let getCountryDetails = async (req, res) => {

    let { id } = req.params

    let data = await countryModal.findOne({ _id: id })
    res.send(
        {
            _status: true,
            _message: "Country Viewed New",
            data
        }
    )
}

module.exports = { createCountry, viewCountry, deleteCountry, updateCountry, countryMultiDelete, changeCountryStatus, getCountryDetails }