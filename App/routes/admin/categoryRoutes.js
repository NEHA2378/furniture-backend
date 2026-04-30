let express = require("express")
// const { categoryController } = require("../../controllers/admin/categoryController")
const { createCategory } = require("../../controllers/admin/categoryController")
let categoryRoutes = express.Router()

const multer  = require('multer')
const { viewCategory } = require("../../controllers/admin/categoryController")
// const upload = multer({ dest: 'uploads/' })  //Middleware

let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/category')
    },
    filename:(req, file, cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})

let upload = multer({ storage: storage })


//upload.single('for single image')
//upload.field('for multiple image')
categoryRoutes.post("/create",upload.single('categoryImage'), createCategory)

categoryRoutes.get("/view",viewCategory)

// categoryRoutes.delete("/delete/:id",deletecategory)
// categoryRoutes.post("/multi-delete", categoryMultiDelete)
// categoryRoutes.post("/change-status", changecategoryStatus)
// categoryRoutes.get("/get-category-details/:id",getcategoryDetails)

// categoryRoutes.put("/update/:id",updatecategory)

module.exports = {categoryRoutes}