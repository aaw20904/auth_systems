var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../db');
var jwt= require('jsonwebtoken');
require('dotenv').config()


router.get('/register',async (req, res, next)=>{
  //register form
 res.render('register',{info:''});
})


router.post('/register',async (req, res, next)=>{
   /**{"username":"bobyk","password","switch"}* */
  let hashed_password;

  /**Is a user with the same name in DB? */
    if (await db.readUser(req.body.username)) {
      res.render('register',{info:'User exists!'});
    } else { 
      /**generating a hashed password */
      hashed_password = await bcrypt.hash(req.body.password, 10);
      /**write a new user into DB: */
     await db.addNewUser(req.body.username, Buffer.from(hashed_password), 0x00 );
      res.redirect('/users/login');
    }
})


router.get ('/login',async (req, res, next)=>{

 res.render('login',{info:''});
})


router.post ('/login',async (req, res, next)=>{ 
   /**get user info */
  let userinfo = await db.readUser(req.body.username)
  if (!userinfo) {
    //if user hsn`t been found:
     res.statusCode = 401;
    
      res.render('login',{info:'Incorrect name or password'});
  } else if ( await bcrypt.compare(req.body.password, userinfo.hashed_psw.toString()) ) {
    //when an authorization is successfull:
   //generating JWT - sign with default (HMAC SHA256)
    let token = await new Promise((resolve, reject) => {

        jwt.sign({name: userinfo.username}, process.env.SECRET_KEY, { expiresIn: 60  },(err, tk)=>{
          if (err) {
            reject(err);
          }
          else {
            resolve(tk);
          }
        })
    }); 
    //save the authentication token in a secure cookie:
    res.cookie('jwt', token , { maxAge: (60000 * 20)|0, secure: true});
    //redirecting to the main page - there is an authentication procedure for users
    res.redirect('../');
  } else{
    //when a password is incorrect and authorization is fail:
    res.statusCode = 401;
     res.render('login',{info:'Incorrect name or password'});
  }
})


router.post('/logout',(req, res, next)=>{
  //clear the cookie and redirecting
  res.clearCookie('jwt');
  res.redirect('/users/login')
})
module.exports = router;
