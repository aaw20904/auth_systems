var express = require('express');
var router = express.Router();
const axios = require("axios");

async function middleware (req, ers, next) {
  if (req.cookies.fb_token) {
      let usrInfo = await axios({
          url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name','picture'].join(','),
          access_token: req.cookies.fb_token,
        },
      })

      req.usrData = usrInfo.data;
  } else {
   req.usrData = false;
  }
  next();


}

/* GET home page. */
router.get('/', middleware, function(req, res, next) {
  if(!req.usrData){
    res.redirect("/users");
  }
  res.render("index",{usr:req.usrData})
});

module.exports = router;
