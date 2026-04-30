const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: [true, "User Id is required"]
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            match: /^[a-zA-Z\s]{2,30}$/,
        },
        mobile_number: {
            type: String,
            required: [true, "Mobile Number is required"]
        },
        order_number: {
            type: String,
            required: [true, "Order Number is required"]
        },
        order_id: {
            type: String,
            default: ''
        },
        payment_id: {
            type: String,
            default: ''
        },
        order_note: {
            type: String,
            default: ''
        },
        billing_address: {
            type: JSON,
            required: [true, 'Billing Address is required']
        },
        shipping_address: {
            type: JSON,
            required: [true, 'Shipping Address is required']
        },
        product_info: {
            type: Array,
            required: [true, 'Product information is required']
        },
        total_amount: {
            type: Number,
            required: [true, 'Total amount is required']
        },
        discount_amount: {
            type: Number,
            required: [true, 'Discount amount is required']
        },
        net_amount: {
            type: Number,
            required: [true, 'Net amount is required']
        },
        payment_status: {
            type: Number,
            default: 1         //1-pending    2-successful     3-failed
        },
        order_status: {
            type: Number,
            default: 1         //1-order placed    2-order received     3-in transit         4-out for delivery        5-completed        6-cancelled         7-failed
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        updated_at: {
            type: Date,
            default: Date.now()
        },
        deleted_at: {
            type: Date,
            default: null
        }
    }
)

const orderModal = mongoose.model('orders', schema);
module.exports = orderModal