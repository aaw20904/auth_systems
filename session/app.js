var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
/**mysql storage - for the session */
const MySQLStore = require('express-mysql-session')(session);

//create store
const sessionStore = new MySQLStore(
    {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '65535258',
    database: 'myappbase',
  }
);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//apply session middleware;\
app.use(session({
  store: sessionStore,
  secret: '15fe8abffe4',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge:(60000*60)|0 },
}))

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
module.exports = app;
