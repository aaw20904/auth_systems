var express = require('express');
const { resolve } = require('path');
const { render } = require('../app');
var router = express.Router();
let cr = require('../cryptography');
let db = require('../db');
let cryptography = new cr();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function(req, res, next){
  //sending a form for log In
  res.render('login.ejs',{info:''});
})



router.post('/login', async function(req, res, next){
  /**req.body.username, req.body.password */
  /**1)Is a user exits in RDBMS?: */
  let userinfo = await db.readUser(req.body.username);
  if (!userinfo) {
    res.render('login',{info:'Incorrect a name or password!'})
  } else {
    //checking the password
      if (await cryptography.validatePassword(req.body.password, userinfo.salt, userinfo.hashed_psw)) {
        //when success - write a user data in the session
        req.session.name = userinfo.username;
        req.session.userid = userinfo.userid;
        res.redirect('/');
      } else {
        //when fail -reload a login page with a warning
        res.render('login',{info:'incorrect a name or password!'})
      }
  }

});



router.get('/register', function(req, res, next){
  //sending a form for log In
  res.render('register.ejs',{info:''});
})

router.post('/register', async function(req, res, next){
 
  let registrationResult;
  let saltAndPassword;
  /**CHECK: is the same username in the DB? */
  if (await db.readUser(req.body.username)) {
    res.render('register',{info:'User already exists!'})
    return;
  }
 /**1) generating salt and hashed password */
  saltAndPassword = await cryptography.hashPassword(req.body.password);
 /**2) write into the DB */
  await db.addNewUser(req.body.username, saltAndPassword.hashedPsw, saltAndPassword.salt);
  /**redirectong to the main page - to log in*/
  res.statusCode = 201;
  res.redirect('/');

});

router.post('/logout', async (req, res, next)=>{
  try{
        await new Promise((resolve, reject) => {
            req.session.destroy((err)=>{
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              })
          });
          res.redirect('/users/login');
  } catch(e) {
    throw new Error(e);
  }

})



module.exports = router;
