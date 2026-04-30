let express = require("express")
let subSubCategoryRoutes = express.Router()

const multer  = require('multer')
const { createSubSubCategory, viewSubSubCategory, getSubCategoryData } = require("../../controllers/admin/subSubCategoryController")
const { getPagerntCategoryData } = require("../../controllers/admin/subCategoryController")
// const upload = multer({ dest: 'uploads/' })  //Middleware

let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/subsubCategory')
    },
    filename:(req, file, cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})

let upload = multer({ storage: storage })


//upload.single('for single image')
//upload.field('for multiple image')
// subSubCategoryRoutes.post("/create",upload.single('subSubCategoryImage'), createSubSubCategory)
subSubCategoryRoutes.post("/create" , upload.single('subSubCategoryImage'), createSubSubCategory)

subSubCategoryRoutes.get("/view", viewSubSubCategory)

subSubCategoryRoutes.get("/parent", getPagerntCategoryData)

subSubCategoryRoutes.get("/sub-category/:parentId", getSubCategoryData)

// subSubCategoryRoutes.delete("/delete/:id",deleteSubSubCategory)
// subSubCategoryRoutes.post("/multi-delete", subSubCategoryMultiDelete)
// subSubCategoryRoutes.post("/change-status", changeSubSubCategoryStatus)
// subSubCategoryRoutes.get("/get-category-details/:id",getSubSubCategoryDetails)

// categoryRoutes.put("/update/:id",updatecategory)

module.exports = {subSubCategoryRoutes}