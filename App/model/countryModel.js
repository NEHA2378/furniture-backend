const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    countryName : {
        type : String,
        required : [true, "Country is required"]
    },
    countryOrder: {
        type : Number,
        required : [true, "Order is required"],
        min : [1, "Minimum 1 value is required"],
        max : [5, "Maximum 5 values are available"]
    },
    countryStatus: {
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

const countryModal = mongoose.model('countries', schema);

module.exports = countryModal;