let express = require("express")
const { colorRoutes } = require("./colorRoutes")
const { materialRoutes } = require("./materialRoutes")
const { countryRoutes } = require("./countryRoutes")
const { faqRoutes } = require("./faqRoutes")
const { categoryRoutes } = require("./categoryRoutes")
const { subCategoryRoutes } = require("./subCategoryRoutes")
const { subSubCategoryRoutes } = require("./subSubCategoryRoutes")
const { productRoutes } = require("./productRoutes")

let adminRoutes = express.Router()

adminRoutes.use("/color", colorRoutes)

adminRoutes.use("/material", materialRoutes)

adminRoutes.use("/country", countryRoutes)

adminRoutes.use("/faq", faqRoutes)

adminRoutes.use("/category", categoryRoutes)

adminRoutes.use("/subcategory", subCategoryRoutes)

adminRoutes.use("/subsubcategory", subSubCategoryRoutes)

adminRoutes.use("/product", productRoutes)

module.exports={adminRoutes}