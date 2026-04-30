let express = require("express")
let subCategoryRoutes = express.Router()

const multer  = require('multer')
const { createSubCategory } = require("../../controllers/admin/subCategoryController")
const { viewSubCategory } = require("../../controllers/admin/subCategoryController")
const { getPagerntCategoryData } = require("../../controllers/admin/subCategoryController")
// const upload = multer({ dest: 'uploads/' })  //Middleware

let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/subCategory')
    },
    filename:(req, file, cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})

let upload = multer({ storage: storage })


//upload.single('for single image')
//upload.field('for multiple image')
// subCategoryRoutes.post("/create",upload.single('subCategoryImage'), createSubCategory)
subCategoryRoutes.post("/create" , upload.single('subCategoryImage'), createSubCategory)

subCategoryRoutes.get("/view", viewSubCategory)

subCategoryRoutes.get("/parent", getPagerntCategoryData)

// subCategoryRoutes.delete("/delete/:id",deleteSubCategory)
// subCategoryRoutes.post("/multi-delete", subCategoryMultiDelete)
// subCategoryRoutes.post("/change-status", changeSubCategoryStatus)
// subCategoryRoutes.get("/get-category-details/:id",getSubCategoryDetails)

// categoryRoutes.put("/update/:id",updatecategory)

module.exports = {subCategoryRoutes}