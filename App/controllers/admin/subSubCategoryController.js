const { mySlug } = require("../../config/helper")
const categoryModal = require("../../model/categoryModel")
const subCategoryModal = require("../../model/subCategoryModel")
const subSubCategoryModal = require("../../model/subSubCategoryModel")

let createSubSubCategory = async (req, res) => {

    let obj = { ...req.body }                      //Parent Category , TopWear, Image
    let slug = mySlug(obj.subSubCategoryName)
    obj['slug'] = slug

    if (req.file) {
        if (req.file.filename) {
            obj['subSubCategoryImage'] = req.file.filename
        }
    }

    try {
        let { subSubCategoryName, subSubCategoryCode, subSubCategoryOrder } = obj;

        // Normalize (avoid Red vs red issue)
        // subSubCategoryName = subSubCategoryName.toLowerCase().trim();
        // subSubCategoryCode = subSubCategoryCode.toLowerCase().trim();

        // Check duplicate
        let existingSubSubCategory = await subSubCategoryModal.findOne({
            $or: [
                { subSubCategoryName: subSubCategoryName },
            ],
            isDeleted: false
        });

        // if (existingSubSubCategory) {
        //     return res.send({
        //         _status: false,
        //         _message: "SubSub Category already exists"
        //     });
        // }

        // if (!subSubCategoryName || !subSubCategoryOrder) {
        //     return res.send({
        //         _status: false,
        //         _message: "Please fill all the required fields"
        //     })
        // }

        // Save normalized values
        let subSubCategory = new subSubCategoryModal({
            ...obj,
            subSubCategoryName
        });

        let subSubCategoryRes = await subSubCategory.save();

        res.send({
            _status: true,
            _message: "New SubSub Category Added",
            subSubCategoryRes
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

let viewSubSubCategory = async (req, res) => {

    let filter = {
        isDeleted: false
    }

    let data = await subSubCategoryModal.find(filter).populate('parentCategory', 'categoryName').populate('subCategory', 'subCategoryName')
    res.send(
        {
            _status: true,
            _message: "Sub-Sub-Category Viewed New",
            path: process.env.SUBSUBCATEGORYPATH,
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

let getSubCategoryData = async (req, res) => {

    let {parentId} = req.params
    let filter = {
        deletedAt: null,
        subCategoryStatus: true,
        parentCategory : parentId
    }
    let data = await subCategoryModal.find(filter).select('subCategoryName')

    res.send(
        {
            _status: true,
            _message: "Sub Category Fpund",
            data
        }
    )
}

module.exports = { createSubSubCategory, viewSubSubCategory, getPagerntCategoryData, getSubCategoryData }