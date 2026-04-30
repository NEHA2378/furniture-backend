const { mySlug } = require("../../config/helper")
const categoryModal = require("../../model/categoryModel")
const subCategoryModal = require("../../model/SubCategoryModel")

let createSubCategory = async (req, res) => {

    let obj = { ...req.body }                      //Parent Category , TopWear, Image
    let slug = mySlug(obj.subCategoryName)
    obj['slug'] = slug

    if (req.file) {
        if (req.file.filename) {
            obj['subCategoryImage'] = req.file.filename
        }
    }

    try {
        let { subCategoryName, subCategoryCode, subCategoryOrder } = obj;

        // Normalize (avoid Red vs red issue)
        // subCategoryName = subCategoryName.toLowerCase().trim();
        // subCategoryCode = subCategoryCode.toLowerCase().trim();

        // Check duplicate
        let existingSubCategory = await subCategoryModal.findOne({
            $or: [
                { subCategoryName: subCategoryName },
            ],
            isDeleted: false
        });

        // if (existingSubCategory) {
        //     return res.send({
        //         _status: false,
        //         _message: "Sub Category already exists"
        //     });
        // }

        // if (!subCategoryName || !subCategoryOrder) {
        //     return res.send({
        //         _status: false,
        //         _message: "Please fill all the required fields"
        //     })
        // }

        // Save normalized values
        let subCategory = new subCategoryModal({
            ...obj,
            subCategoryName
        });

        let subCategoryRes = await subCategory.save();

        res.send({
            _status: true,
            _message: "New Sub Category Added",
            subCategoryRes
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

}

let viewSubCategory = async (req, res) => {

    let filter = {
        isDeleted: false
    }

    let data = await subCategoryModal.find(filter).populate('parentCategory', 'categoryName')
    res.send(
        {
            _status: true,
            _message: "Sub-Category Viewed New",
            path: process.env.SUBCATEGORYPATH,
            data
        }
    )
}

let getPagerntCategoryData = async (req, res) => {

    let filter = {
        deletedAt: null,
        categoryStatus: true
    }
    let data = await categoryModal.find(filter).select('categoryName')

    res.send(
        {
            _status: true,
            _message: "Category Fpund",
            data
        }
    )

}

module.exports = { createSubCategory, viewSubCategory, getPagerntCategoryData }