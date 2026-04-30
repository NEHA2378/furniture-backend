let express = require("express")
// const { colorController } = require("../../controllers/admin/colorController")
const { createColor, viewColor, deleteColor, updateColor, colorMultiDelete, changeColorStatus, getColorDetails } = require("../../controllers/admin/colorController")
let colorRoutes = express.Router()

colorRoutes.post("/create",createColor)

colorRoutes.post("/view",viewColor)

colorRoutes.delete("/delete/:id",deleteColor)
colorRoutes.post("/multi-delete", colorMultiDelete)
colorRoutes.post("/change-status", changeColorStatus)
colorRoutes.get("/get-color-details/:id",getColorDetails)

colorRoutes.put("/update/:id",updateColor)

module.exports = {colorRoutes}