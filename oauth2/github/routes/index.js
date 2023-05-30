var express = require('express');
var router = express.Router();
const axios = require("axios");

/**the middleware function. 
It uses to retrive user info: avatar, id, name end ther parameters */
async function getUsrInfo (req, res, next) {
  if (req.cookies.git_token) {
    let userinfo = await axios.get("https://api.github.com/user",{
      headers:{
        Authorization: `Bearer ${req.cookies.git_token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }

    });
    ///name company location avatar_url, id, name
       const {data} = userinfo;
       req.user = {avatar_url: data.avatar_url, id: data.id, name: data.name};
      next();

  } else {
      req.user = false;
      next();
  }  
  
}

/* GET home page. */
router.get('/', getUsrInfo, function(req, res, next) {
  if (!req.user){
    res.redirect("/users");
    return
  }
  res.render('index', {user: req.user });
});



module.exports = router;
