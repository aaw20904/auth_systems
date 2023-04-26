var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /**has a user authorized? */
  if(req.session.userid) {
    res.render('index',{title:'you are in system!', user: req.session.name});
  } else{
    res.redirect('/users/login');
  }

});

module.exports = router;
