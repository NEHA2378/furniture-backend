const { mySlug } = require("../../config/helper")
const categoryModal = require("../../model/categoryModel")

let createCategory = async (req, res) => {

    let obj = { ...req.body }
    let slug = mySlug(obj.categoryName)
    obj['slug'] = slug

    if (req.file) {
        if (req.file.filename) {
            obj['categoryImage'] = req.file.filename
        }
    }

    try {
        let { categoryName, categoryCode, categoryOrder } = obj;

        // Normalize (avoid Red vs red issue)
        // categoryName = categoryName.toLowerCase().trim();
        // categoryCode = categoryCode.toLowerCase().trim();

        // Check duplicate
        let existingCategory = await categoryModal.findOne({
            $or: [
                { categoryName: categoryName },
            ],
            isDeleted: false
        });

        if (existingCategory) {
            return res.send({
                _status: false,
                _message: "Category already exists"
            });
        }

        if (!categoryName || !categoryOrder) {
            return res.send({
                _status: false,
                _message: "Please fill all the required fields"
            })
        }

        // Save normalized values
        let category = new categoryModal({
            ...obj,
            categoryName
        });

        let categoryRes = await category.save();

        res.send({
            _status: true,
            _message: "New Category Added",
            categoryRes
        });

    }
    catch (dbError) {
        res.send({
            _status: false,
            _message: dbError.message,
            dbError
        });
    }
    console.log(obj);


    // { categoryName: 'Men', categoryOrder: '1', categoryImage: '1775723418724logo-1.png' }
    // console.log(req.body);
    // console.log(req.file);
}

let viewCategory = async (req, res) => {

    let filter = {
        isDeleted: false
    }

    let data = await categoryModal.find(filter)
    res.send(
        {
            _status: true,
            _message: "Category Viewed New",
            path: process.env.CATEGORYPATH,
            data
        }
    )
}

module.exports = { createCategory, viewCategory }