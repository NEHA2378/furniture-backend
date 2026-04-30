const { mySlug } = require("../../config/helper")
const categoryModal = require("../../model/categoryModel")
const colorModal = require("../../model/colorModel")
const materialModal = require("../../model/materialModel")
const productModal = require("../../model/productModel")
const subCategoryModal = require("../../model/subCategoryModel")
const subSubCategoryModal = require("../../model/subSubCategoryModel")

let createProduct = async (req, res) => {

    let obj = { ...req.body }                      //Parent Category , TopWear, Image
    let slug = mySlug(obj.productName)
    obj['slug'] = slug

    if (req.files && req.files['productImage'] && req.files['productImage'].length > 0) {
        obj['productImage'] = req.files['productImage'][0].filename
    }

    try {
        let { productName, productCode, productOrder } = obj;

        // Normalize (avoid Red vs red issue)
        // productName = productName.toLowerCase().trim();
        // productCode = productCode.toLowerCase().trim();

        // Check duplicate
        let existingproduct = await productModal.findOne({
            $or: [
                { productName: productName },
            ],
            isDeleted: false
        });

        // if (existingproduct) {
        //     return res.send({
        //         _status: false,
        //         _message: "SubSub Category already exists"
        //     });
        // }

        // if (!productName || !productOrder) {
        //     return res.send({
        //         _status: false,
        //         _message: "Please fill all the required fields"
        //     })
        // }

        // Save normalized values
        let product = new productModal({
            ...obj,
            productName
        });

        let productRes = await product.save();

        res.send({
            _status: true,
            _message: "New SubSub Category Added",
            productRes
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

let viewProduct = async (req, res) => {

    let filter = {
        isDeleted: false
    }

    let totalRecords = await productModal.find(filter).countDocuments()


    var limit = 2;
    var skip = 0;
    var page = 1;

    if (req.body != undefined) {
        if (req.body.page != undefined && req.body.page != '') {
            page = req.body.page;
            skip = (page - 1) * limit
        }
    }

    var paginate = {
        totalRecords: totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit)
    }

    let data = await productModal.find(filter).populate('parentCategory', 'categoryName').populate('subCategory', 'subCategoryName')
    res.send(
        {
            _status: true,
            _message: "Product Viewed",
            path: process.env.PRODUCTPATH,
            data
        }
    )
}

let getParentCategoryData = async (req, res) => {

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

    let { parentId } = req.params
    let filter = {
        deletedAt: null,
        subCategoryStatus: true,
        parentCategory: parentId
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

let getSubSubCategoryData = async (req, res) => {

    let { subCategoryId } = req.params
    let filter = {
        deletedAt: null,
        subSubCategoryStatus: true,
        subCategory: subCategoryId
    }
    let data = await subSubCategoryModal.find(filter).select('subSubCategoryName')

    res.send(
        {
            _status: true,
            _message: "Sub Sub Category Found",
            data
        }
    )
}

let getProductColors = async (req, res) => {


    let filter = {
        deletedAt: null,
        colorStatus: true,

    }
    let data = await colorModal.find(filter).select('colorName')

    res.send(
        {
            _status: true,
            _message: "Color Found",
            data
        }
    )
}

let getProductMaterials = async (req, res) => {


    let filter = {
        deletedAt: null,
        materialStatus: true,

    }
    let data = await materialModal.find(filter).select('materialName')

    res.send(
        {
            _status: true,
            _message: "Material Found",
            data
        }
    )
}

module.exports = { createProduct, viewProduct, getParentCategoryData, getSubCategoryData, getSubSubCategoryData, getProductColors, getProductMaterials }