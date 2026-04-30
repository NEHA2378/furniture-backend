let express = require("express")
const { faqMultiDelete,changeFAQStatus, getFAQDetails, createFAQ, viewFAQ, deleteFAQ, updateFAQ } = require("../../controllers/admin/faqController")
let faqRoutes = express.Router()

faqRoutes.post("/create",createFAQ)

faqRoutes.get("/view",viewFAQ)

faqRoutes.delete("/delete/:id",deleteFAQ)
faqRoutes.post("/multi-delete", faqMultiDelete)
faqRoutes.post("/change-status", changeFAQStatus)
faqRoutes.get("/get-faq-details/:id",getFAQDetails)

faqRoutes.put("/update/:id",updateFAQ)

module.exports = {faqRoutes}