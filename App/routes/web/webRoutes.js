let express = require("express")
const { authRoutes } = require("./authRoutes")

let webRoutes = express.Router()

webRoutes.use('/user', authRoutes)

module.exports = {webRoutes}