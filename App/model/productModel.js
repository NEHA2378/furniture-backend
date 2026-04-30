const { default: mongoose } = require("mongoose");


// const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    productName: {
        type: String,
        minLength: [3, 'Minimum 3 characters are required'],
        required: true,
        unique: true
    },
    productImage: {
        type: String,
        unique: true
    },
    slug: {
        type: String,
    },
    productOrder: {
        type: Number,
        required: [true, "Order is required"],
        min: [1, "Minimum 1 value is required"],
        max: [5, "Maximum 5 values are available"]
    },
    productStatus: {
        type: Boolean,
        default: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    parentCategory: {
        type: mongoose.Types.ObjectId,    ///obj Id Stored
        ref: "categories"                  ///categoryModel
    },
    subCategory: {
        type: mongoose.Types.ObjectId,    ///obj Id Stored
        ref: "subCategories"                  ///subcategoryModel
    },
    subSubCategory: {
        type: mongoose.Types.ObjectId,    ///obj Id Stored
        ref: "subSubCategories"                  ///subcategoryModel
    },
    productMaterial: [{
        type: mongoose.Types.ObjectId,    ///obj Id Stored
        ref: "materials"                  ///subcategoryModel
    }],
    productColor: [{
        type: mongoose.Types.ObjectId,    ///obj Id Stored
        ref: "colors"                  ///subcategoryModel
    }],
    productDescription: {
        type: String
    },
    productSalePrice: {
        type: Number
    },
    productActualPrice: {
        type: Number
    },
    productStock: {
        type: Number
    },
    productGallery: {
        type: Array
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
});

const productModal = mongoose.model('products', schema);

module.exports = productModal;