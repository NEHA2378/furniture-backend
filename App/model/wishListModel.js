const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    product_id: {
        type: Number,
        required: true
    }
});

const wishlistModel = mongoose.model("wishlist", wishlistSchema);
module.exports = { wishlistModel };