const { default: mongoose } = require("mongoose");

// const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    colorName: {
        type: String,
        minLength :[3, 'Minimum 3 characters are required'],
        maxLength : [ 15, 'Maximum 15 characters are allowed'],
        required: true,
        unique : true
    },
    colorCode: {
        type: String,
        required: [true, "Code is required"],
        unique : true
    },
    colorOrder: {
        type : Number,
        required : [true, "Order is required"],
        min : [1, "Minimum 1 value is required"],
        max : [5, "Maximum 5 values are available"]
    },
    colorStatus: {
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
});

const colorModal = mongoose.model('colors', schema);

module.exports = colorModal;