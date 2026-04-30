const { default: mongoose, Schema } = require("mongoose");
const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            match: /^[a-zA-Z\s]{2,30}$/,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        mobile_number: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        gender: {
            type: String,
            default: ''        //1-male 2-female
        },
        image: {
            type: String,
            default: ''
        },
        role_type: {
            type: String,
            default: 'user',
            enum: ['admin', 'user']
        },
        status: {
            type: Boolean,
            default: 1
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        deleted_at: {
            type: Date,
            default: null
        },
        resetPasswordToken: {
            type: String,
            default: ''
        },
        resetPasswordExpires: {
            type: Date,
            default: null
        }
    }
)

const userModal = mongoose.model('users', schema)

module.exports = { userModal }