const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    product_id: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

const cartModel = mongoose.model("cart", cartSchema);

module.exports = { cartModel };