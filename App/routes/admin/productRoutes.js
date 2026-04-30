let express = require("express")
let productRoutes = express.Router()

const multer = require('multer')
const { viewProduct, getParentCategoryData, getSubCategoryData, createProduct, getSubSubCategoryData, getProductColors, getProductMaterials } = require("../../controllers/admin/productController")
// const upload = multer({ dest: 'uploads/' })  //Middleware

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/product')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

let upload = multer({ storage: storage })


//upload.single('for single image')
//upload.field('for multiple image')
// subSubCategoryRoutes.post("/create",upload.single('subSubCategoryImage'), createSubSubCategory)
productRoutes.post("/create", upload.fields(
    [
        {
            name: "productImage",
            maxCount: 1
        },
        {
            name: "productGallery",
            maxCount: 10
        }
    ]
), createProduct)

productRoutes.post("/view", viewProduct)

productRoutes.get("/parent", getParentCategoryData)

productRoutes.get("/sub-category/:parentId", getSubCategoryData)

productRoutes.get("/sub-sub-category/:subCategoryId", getSubSubCategoryData)

productRoutes.get("/color", getProductColors)

productRoutes.get("/material", getProductMaterials)

// productRoutes.delete("/delete/:id",deleteSubSubCategory)
// productRoutes.post("/multi-delete", subSubCategoryMultiDelete)
// productRoutes.post("/change-status", changeProductStatus)
// productRoutes.get("/get-category-details/:id",getSubSubCategoryDetails)

// productRoutes.put("/update/:id",updatecategory)

module.exports = { productRoutes }