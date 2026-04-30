const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    materialName : {
        type : String,
        required : [true, "Material is required"]
    },
    materialOrder: {
        type : Number,
        required : [true, "Order is required"],
        min : [1, "Minimum 1 value is required"],
        max : [5, "Maximum 5 values are available"]
    },
    materialStatus: {
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
    }
})

const materialModal = mongoose.model('materials', schema);

module.exports = materialModal;