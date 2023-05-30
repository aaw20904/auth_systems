var express = require('express');
var router = express.Router();
const user_id =  "2ae2156246dd2cd9dc62";
const user_secret = "3017244985984831c7c95350452c914c1616d08a";
const querystring = require('node:querystring');
const axios = require("axios");
//URI parameters for the first request to oauth2 git server
const loginParams = querystring.stringify({
                            client_id:user_id,
                             redirect_uri:"http://localhost:8080/users/callback",
                            scope: ['read:user', 'user:email'].join(' '),  
                            allow_signup: true, 
}) 


//1) page for authentication a user - for example  "https://example.com/users"
router.get('/', function(req, res, next) {
  res.render("users",{reference:`https://github.com/login/oauth/authorize?${loginParams}`})
});

//---oauth2 server response in this route with a code.It uses to get access_token
//2) processing temporary code from Git Auth server
router.get("/callback", async (req, res)=>{
  
    const code =  req.query.code;
   //3)making request to get an access_token
   let token;

   try {
          token = await axios.post("https://github.com/login/oauth/access_token",{
            client_id: user_id,
            client_secret: user_secret,
            code: code,
            /*  !! you MUSN'T include "redirect_uri" in this request !!! Don`t write "redirect_uri" here !!  */ 
          },

          {
            headers: {
                        Accept: "application/json"
                     }
          });
    } catch (e) {
         res.statusCode=500;
          res.end("server error");
          return;
   }
     /*4) assign the token to cookie (or save in DB). 
      There are three props in tokens.data: .access_token, .token_type, .scope
    */
 
    if(!token.data.access_token) {
      //when any error occured - redirect to the start page
      res.redirect("/users");
      return;
    }
    //You can save the access token in any DB. For simplification saving access token in cookie. 
    res.cookie("git_token", token.data.access_token,{maxAge:60000*10});
    res.redirect("/");

})

module.exports = router;
