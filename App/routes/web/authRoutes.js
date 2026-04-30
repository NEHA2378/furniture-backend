let express = require("express")
let authRoutes = express.Router()
const { register, login, changePassword, forgotPassword, resetPassword, updateProfile, viewProfile, addtoCart, removeFromCart, getCart, updateCart, addToWishlist, getWishlist } = require("../../controllers/web/authController")
const { checkToken } = require("../../middleware/checkToken")

const multer  = require('multer')
const { placeOrder, changeOrderStatus, getOrders } = require("../../controllers/web/orderPlaceController")
// const upload = multer({ dest: 'uploads/' })  //Middleware

let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/users')
    },
    filename:(req, file, cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})

let upload = multer({ storage: storage })

authRoutes.post('/create', register)
authRoutes.post('/login', login)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.put('/reset-password/:id', resetPassword)

authRoutes.post('/view-profile', upload.none(), checkToken, viewProfile)
authRoutes.post('/update-profile',checkToken, upload.single("image"), updateProfile)
authRoutes.post('/change-password',checkToken, changePassword)

authRoutes.post('/order-place', upload.none(), checkToken, placeOrder)
authRoutes.post('/order-status-change', upload.none(), checkToken, changeOrderStatus)
authRoutes.get('/orders', checkToken, getOrders)

authRoutes.post('/add-to-cart', upload.none(), checkToken, addtoCart)
authRoutes.post('/remove-from-cart', upload.none(), checkToken, removeFromCart)
authRoutes.get('/cart', upload.none(), checkToken, getCart)
authRoutes.post('/update-cart-quantity', checkToken, updateCart)

authRoutes.post("/wishlist-toggle", checkToken, addToWishlist);
authRoutes.get("/wishlist", checkToken, getWishlist);




module.exports = {authRoutes}