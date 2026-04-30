const faqModal = require("../../model/faqModel")


let createFAQ = async (req, res) => {
    let bodyData = req.body;
    try {
        let { faqQuestion, faqAnswer, faqOrder } = bodyData

        // Normalize
        faqQuestion = faqQuestion.toLowerCase().trim();
        faqAnswer = faqAnswer.toLowerCase().trim();

        // Check duplicate
        let existingFAQ = await faqModal.findOne({
            $or: [
                { faqQuestion: faqQuestion },
                { faqAnswer: faqAnswer }
            ],
            isDeleted: false
        });

        if (existingFAQ) {
            return res.send({
                _status: false,
                _message: "FAQ already exists"
            });
        }

        if (!faqQuestion || !faqAnswer || !faqOrder) {
            return res.send({
                _status: false,
                _message: "Please fill all the required fields"
            })
        }

        // Save normalized values
        let faq = new faqModal({
            ...bodyData,
            faqQuestion,
            faqAnswer,
            faqOrder
        });

        let faqRes = await faq.save()

        res.send(
            {
                _status: true,
                _message: " New FAQ Added",
                faqRes
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

let viewFAQ = async (req, res) => {

    let filter = {
        isDeleted: false
    }

    let data = await faqModal.find(filter)
    res.send(
        {
            _status: true,
            _message: "FAQ Viewed New",
            data
        }
    )
}

let deleteFAQ = async (req, res) => {
    let { id } = req.params
    let deleteStatus = await faqModal.updateOne(
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
            _message: "FAQ Deleted New",
            deleteStatus
        }
    )
}

let faqMultiDelete = async (req, res) => {
    let { ids } = req.body
    let deleteStatus = await faqModal.updateMany(
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
            _message: "FAQ Deleted New",
            deleteStatus
        }
    )
}

let updateFAQ = async (req, res) => {
    let { id } = req.params
    let { faqQuestion, faqAnswer, faqOrder } = req.body

    try {

        // Check duplicate
        let existingFAQ = await faqModal.findOne({
            $or: [
                { faqQuestion: faqQuestion },
                { faqAnswer: faqAnswer }
            ],
            _id: { $ne: id },
            isDeleted: false
        });

        if (existingFAQ) {
            return res.send({
                _status: false,
                _message: "FAQ already exists"
            });
        }

        // Basic validation
        if (!faqQuestion || !faqAnswer || !faqOrder) {
            return res.send({
                _status: false,
                _message: "All fields are required"
            })
        }

        // Update with mongoose (IMPORTANT: runValidators)
        let updateRes = await faqModal.updateOne(
            { _id: id },
            {
                $set: {
                    faqQuestion,
                    faqAnswer,
                    faqOrder
                }
            },
            { runValidators: true }   // THIS IS IMPORTANT
        )

        res.send({
            _status: true,
            _message: "FAQ Updated Successfully",
            updateRes
        })

    } catch (error) {

        
        res.send({
            _status: false,
            _message: error.message
        })
    }
}

let changeFAQStatus = async (req, res) => {
    let { ids } = req.body

    let faqStatus = await faqModal.updateMany(
        { _id: ids },
        [
            {
                $set: {
                    faqStatus: {
                        $not: '$faqStatus'
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
            _message: "FAQ Status Changed",

        }
    )
}

let getFAQDetails = async (req, res) => {

    let { id } = req.params

    let data = await faqModal.findOne({ _id: id })
    res.send(
        {
            _status: true,
            _message: "FAQ Viewed New",
            data
        }
    )
}

module.exports = { createFAQ, viewFAQ, deleteFAQ, updateFAQ, faqMultiDelete, changeFAQStatus, getFAQDetails }