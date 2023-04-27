var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../db');
var jwt= require('jsonwebtoken');
require('dotenv').config()
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register',async (req, res, next)=>{

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
      hashed_password = await bcrypt.hash(req.body.password,10);
      /** */
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
      res.render('register',{info:'Incorrect name or password'});
  } else if ( await bcrypt.compare(req.body.password, userinfo.hashed_psw.toString()) ) {
    //when an authorization is successfull:

    let token = await new Promise((resolve, reject) => {
        jwt.sign(JSON.stringify({name: userinfo.username}),'mysecretkey',(err, tk)=>{
          if(err){reject(err)}
          else {
            resolve(tk);
          }
        })
    }); 
    res.setHeader('WWW-Authenticate',`Basic`)
    res.json(req.body);
  } else{
    //when a password is incorrect:
     res.render('register',{info:'Incorrect name or password'});
  }
})

module.exports = router;
