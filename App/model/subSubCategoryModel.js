const { default: mongoose } = require("mongoose");

// const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    subSubCategoryName: {
        type: String,
        minLength: [3, 'Minimum 3 characters are required'],
        required: true,
        unique: true
    },
    subSubCategoryImage: {
        type: String,
        unique: true
    },
    slug: {
        type: String,
    },
    subSubCategoryOrder: {
        type: Number,
        required: [true, "Order is required"],
        min: [1, "Minimum 1 value is required"],
        max: [5, "Maximum 5 values are available"]
    },
    subSubCategoryStatus: {
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
    }
});

const subSubCategoryModal = mongoose.models.subSubCategories || mongoose.model('subSubCategories', schema);

module.exports = subSubCategoryModal;