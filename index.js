let express = require("express")
const { adminRoutes } = require("./App/routes/admin/adminRoutes")
require("dotenv").config()
let cors = require("cors")

// Using Node.js `require()`
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

    mongoose.connect('mongodb://nehaparmar2378_db_user:ApzBBnJIYKKf8cMJ@ac-bj1frvr-shard-00-00.jza8md8.mongodb.net:27017,ac-bj1frvr-shard-00-01.jza8md8.mongodb.net:27017,ac-bj1frvr-shard-00-02.jza8md8.mongodb.net:27017/onlineFurnitureShop?ssl=true&replicaSet=atlas-ij9y8f-shard-0&authSource=admin&appName=Cluster0')
        .then(() => console.log('Connected!'));
    console.log("Server Started", process.env.PORT);

})