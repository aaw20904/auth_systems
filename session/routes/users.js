var express = require('express');
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
  /**1)read a user from the RDBMS: */

  let userinfo = await db.readUser(req.body.username);
  if(!userinfo){
    res.statusCode = 304;
    res.render('login',{info:'Incorrect username or password!'})
  } else {
      //checking - is a password correct?
      if (await cryptography.validatePassword(Buffer.from(req.body.password), userinfo.salt, userinfo.hashed_psw)){

        //when success - wride a data to session and finaly redirecting to the start page
        req.session.username = req.body.username;
        req.session.userid = userinfo.userid;

        res.redirect('/');
      } else {
        res.statusCode = 304;
        res.render('login',{info:'Incorrect username or password!'})
      }   
  
  }

  //res.json(req.body);
});



router.get('/register', function(req, res, next){
  //sending a form for log In
  res.render('register.ejs',{info:''});
})

router.post('/register', async function(req, res, next){
  /**req.body.username, req.body.password */
  //console.log(req.body);
  //res.json(req.body);
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
  res.statusCode = 201;
  res.redirect('/users/login');

});



module.exports = router;
