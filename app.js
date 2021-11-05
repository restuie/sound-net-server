require("dotenv").config()
require("./config/database").connect()
const express = require("express")
const userRoutes = require('./routes/user-routes')
const app = express()
app.use(express.json())
const User = require("./model/user");
app.use('/api',userRoutes.routes)

module.exports = app