const { default: mongoose } = require("mongoose");

// const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    subCategoryName: {
        type: String,
        minLength :[3, 'Minimum 3 characters are required'],
        required: true,
        unique : true
    },
    subCategoryImage: {
        type: String,
        unique : true
    },
    slug: {
        type: String,
    },
    subCategoryOrder: {
        type : Number,
        required : [true, "Order is required"],
        min : [1, "Minimum 1 value is required"],
        max : [5, "Maximum 5 values are available"]
    },
    subCategoryStatus: {
        type : Boolean,
        default : true
    },

    isDeleted: {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date,
        default : null
    },
    parentCategory : {
        type : mongoose.Types.ObjectId,    ///obj Id Stored
        ref: "categories"                  ///categoryModel
    }
});

const subCategoryModal = mongoose.model('subCategories', schema);

module.exports = subCategoryModal;