var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 /* if(req.session.userid ){
    res.json(req.session)
  } else {
    res.redirect('/users/login');
  }*/
  res.json(req.session);
  
  //res.render('login.ejs',{info:''})
  //res.render('register.ejs',{info:''});
  
 /* res.render('index', { title: 'Express' });*/
});

module.exports = router;
