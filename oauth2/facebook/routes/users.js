var express = require('express');
var router = express.Router();
const axios = require("axios");
const querystring = require('node:querystring');

//create URI params - it will call from the frontend page
const fbParams = querystring.stringify({
client_id: 795343332151021,
  redirect_uri: 'https://localhost/users/fb',

  /*scope: ['email', 'user_friends'].join(','), // comma seperated string
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup',*/
});
console.log(fbParams);
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users",{link:`https://www.facebook.com/v6.0/dialog/oauth?${fbParams}`});
});

router.get("/fb",async (req,res)=>{
  //response of FB server:
  let code = req.query.code;
  //senfd request to get an access token:
    const token = await axios({
      url: 'https://graph.facebook.com/v6.0/oauth/access_token',
        method: 'get',
        params: {
          client_id: 795343332151021,
          client_secret: "016d1d88f8952dc064c8a44cedefea64",
          redirect_uri:  'https://localhost/users/fb',
          code,
        }
    })  
    //token.data.code contains the access token.It may be used to get user data from the FB server
    res.cookie("fb_token",token.data.access_token, {maxAge: 60000 * 30 });
    res.redirect("/");
})
//when user exit:
router.get("/logoff",(req,res)=>{
  res.clearCookie("fb_token");
  res.redirect("/users")
})

module.exports = router;
