const jwt = require('jsonwebtoken')
const User = require('../Models/User')


const verifyToken =(req,res,next) => {
    const token = req.cookies.token
    //console.log(token)
    if(!token) return res.render('home',{message: 'Bạn chưa đăng nhập'})

    try {
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        User.findOne({username:decoded.username})
            .then((user)=>{
                res.locals.user=user;
                return next()
            })
            .catch((error)=>{
                console.log(error)
                return;
            })
        //console.log(decoded)
        
    } catch (error) {
        console.log(error)
        return res.json({message:error})
    }
}

const verifyLogin = function(req, res,next) {
    if(!req.cookies.token) {
        return next()
    }
    return res.redirect('/')
}
module.exports = {verifyToken,verifyLogin}