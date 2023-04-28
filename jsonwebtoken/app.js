
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**using middleware: */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/** ! authentication middleware */
app.use(async (req, res, next)=>{
   let jwtData;
   if(req.cookies.jwt) {
    //when a cookie - 'token' exists:
       try{
            jwtData = await  new Promise((resolve, reject) => {
                            jwt.verify (req.cookies.jwt, process.env.SECRET_KEY,(err, result)=>{
                                if (err) {
                                  reject(err);
                                  //when the JWT isn`t valid:
                                } else {
                                  //when OK:
                                  resolve(result);
                                }
                            })
                       })
        } catch(e) {
          req.appAuthData = false;
          next();
        }
        //when authentication has been passed  SUCCESSFULLY:
        //apply userinfo to the request as a property: 
        req.appAuthData = jwtData;
        next();
   } else {
        req.appAuthData = false;
        next();
   }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);

///module.exports = app;
