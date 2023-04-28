var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
require('dotenv').config();

/* GET home page. */
router.get('/', async function(req, res, next) {
  /**has an authentication been successfull?*/
  //NOTE: the authentication middleware is in "app.js" file 
  if (! req.appAuthData ) {
    res.statusCode = 401;
    res.redirect('/users/login');
  } else  {
        /**when authorization   */
        res.render('index',{title:'JWT', user:req.appAuthData.name});
  }

});

module.exports = router;
