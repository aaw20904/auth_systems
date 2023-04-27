var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let headers = "Headers \r\n";
  for(let idx=0; idx < req.rawHeaders.length; idx += 2) {
    headers += ` ${req.rawHeaders[idx]}  ${req.rawHeaders[idx+1]} \r\n` 
  }
  res.end(headers);
  //res.render('index', { title: 'Express' });
});

module.exports = router;
