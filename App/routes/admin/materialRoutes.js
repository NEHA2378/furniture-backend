let express = require("express")
const { createMaterial, viewMaterial, deleteMaterial, updateMaterial, materialMultiDelete, changeMaterialStatus, getMaterialDetails } = require("../../controllers/admin/materialController")
let materialRoutes = express.Router()

materialRoutes.post("/create",createMaterial)

materialRoutes.get("/view",viewMaterial)

materialRoutes.delete("/delete/:id",deleteMaterial)
materialRoutes.post("/multi-delete", materialMultiDelete)
materialRoutes.post("/change-status", changeMaterialStatus)
materialRoutes.get("/get-material-details/:id",getMaterialDetails)

materialRoutes.put("/update/:id",updateMaterial)

module.exports = {materialRoutes}