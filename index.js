
let express = require("express")
const { adminRoutes } = require("./App/routes/admin/adminRoutes")
let cors = require("cors")
const mongoose = require('mongoose');
const { webRoutes } = require("./App/routes/web/webRoutes");

let App = express()

App.use(cors())
App.use(express.json())
App.use(express.urlencoded({ extended: true }))

App.use('/uploads', express.static('uploads'))
App.use('/uploads/product', express.static('uploads/product'))
App.use("/uploads/category", express.static("uploads/category"))
App.use("/uploads/subcategory", express.static("uploads/subCategory"))
App.use("/uploads/subsubcategory", express.static("uploads/subsubCategory"))

App.use("/admin", adminRoutes)
App.use("/web", webRoutes)

App.listen(process.env.PORT || 8000, () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected!'));
    console.log("Server Started", process.env.PORT);
})