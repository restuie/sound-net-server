
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {userRegister ,userLogin} = require('../controllers/userController')

router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/welcome',auth,async(req,res,next)=>{
    res.status(200).send("Welcome 🙌 ");
})

module.exports = {
    routes:router
}