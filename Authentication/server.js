require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const port = 3000
var handlebars = require('express-handlebars')
const db= require('./config/db')
const path = require('path')
const User = require('./Models/User')
var methodOverride = require('method-override')
const AuthVerify = require('./Middleware/AuthMiddleware')
const cookieParser = require('cookie-parser')
const {mongooseArrToObject,mongooseSingle} =require('./until')
const Product=require('./Models/Product')
app.use(express.json())
app.use(cookieParser())
db.connect()

app.use (express.urlencoded())

app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

app.engine('hbs',handlebars({
  extname:'.hbs',}))

app.set('view engine', 'hbs')

app.set('views',path.join(__dirname,'/resourses/views'))



app.get('/',AuthVerify.verifyToken, (req, res) => {
  return res.render('home',{ 
    user:mongooseSingle(res.locals.user)
  })
})

app.get('/product',AuthVerify.verifyToken, (req, res)=>{
  Product.find({user:res.locals.user._id})
    .then((product) =>{
     // console.log(product)
      return res.render('product', {product:mongooseArrToObject(product)})
    })
    .catch((error) =>{
      console.log(error)
    })
})

app.get('/register',AuthVerify.verifyLogin, (req, res) => {
  return res.render('register')
})

app.post('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  User.findOne({username})
    .then(user=> {
      if(user) {
        return res.render('register',{message:'Tên người dùng đã tồn tại!!!'})
      }else {
        const user=new User(
          {
            username:username,
            password:password
        })
        user.save()
          .then(() => {
            return res.render('login',{message:'Tạo thành công vui lòng đăng nhập!!'})
            //return res.send('Tạo thành công vui lòng đăng nhập!!')
          })
          .catch(err=>{
            return res.send(err)
          })
      }
    })
    .catch(err => {
       return res.send('Lỗi server!!')
    })
})

app.post('/login', (req, res)=>{
  var username = req.body.username
  var password = req.body.password
  User.findOne({ username: username})
    .then((user) => {
      if(!user) {
        return res.render('login',{message:'User name hặc mật khẩu không đúng!!'})
      }
      else
      {
        if(user.password !== password) {
          return res.render('login',{message:'User name hặc mật khẩu không đúng!!'})
        }
        else
        {
          const accesstoken=jwt.sign({username:username},process.env.ACCESS_TOKEN_SECRET)
          res.cookie('token',accesstoken)
          res.cookie('isLogin',true)
          return res.render('home',{
            messageSuccess:'Chúc mừng bạn đăng nhập thành công',
            user:mongooseSingle(user)
            }
          )
        }
      }
    })
    .catch(err=>{
      console.log(err)
    })
})

app.get('/login',AuthVerify.verifyLogin, (req, res) => {
  return res.render('login')
})

app.get('/logout',(req, res)=>{
  res.clearCookie('token')
  return res.redirect('/login')
})

app.get('/product/create',AuthVerify.verifyToken,(req, res)=>{
  res.render('create')
})

app.post('/product/create',AuthVerify.verifyToken, (req, res)=>{
  
  var newProduct = new Product({
    name: req.body.name,
    img: req.body.img,
    price: req.body.price,
    user:res.locals.user._id,
  })
  newProduct.save()
    .then(()=>{
      return res.redirect('/product')
    })
    .catch(err => {
      console.error(err)
    })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})