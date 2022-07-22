var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv");

const { Connection } = require("./model/config");

dotenv.config();

// GOOGLE Auth
// require('./controller/utility/GoogleStrategy');


// DB Configuration
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
exports.MAIL_USER = process.env.MAIL_USER;
exports.MAIL_PASS = process.env.MAIL_PASS;

const URL =
  process.env.MONGODB_URI ||
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@bilal1.1gjzw.mongodb.net/myDB?retryWrites=true&w=majority`;

Connection(URL);




const passport = require("passport");
const expressSession = require("express-session");
const User = require("./model/userSchema");

var getRouter = require("./routes/getRouter");
var postRouter = require("./routes/postRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "codeato",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", getRouter);
app.use("/", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
