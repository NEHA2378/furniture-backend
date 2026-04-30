let express = require("express")
const { createCountry, viewCountry, deleteCountry, updateCountry, countryMultiDelete,changeCountryStatus, getCountryDetails } = require("../../controllers/admin/countryController")
let countryRoutes = express.Router()

countryRoutes.post("/create",createCountry)

countryRoutes.get("/view",viewCountry)

countryRoutes.delete("/delete/:id",deleteCountry)
countryRoutes.post("/multi-delete", countryMultiDelete)
countryRoutes.post("/change-status", changeCountryStatus)
countryRoutes.get("/get-country-details/:id",getCountryDetails)

countryRoutes.put("/update/:id",updateCountry)

module.exports = {countryRoutes}