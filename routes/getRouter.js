var express = require("express");
var router = express.Router();

const passport = require('passport');
const User = require("../model/userSchema");
const Course = require('../model/courseSchema');

const {
  homeRoute,
  adminRoute,
  adminPageRoute,
  addCourseRoute,
  addRoute,
  coursesRoute,
  myclassRoute,
  classlinkRoute,
  reviewRoute,
  profileRoute,
  delprofileRoute,
  signupRoute,
  signin,
  postlikeRoute,
  postdislikeRoute,
  postdeleteRoute,
} = require("../controller/getController");

//----------------------------------------GET ROUTES-------------------------------------------------

/* GET / route. */
router.get("/", homeRoute);

/* GET /admin route. */
router.get("/admin", adminRoute);

/* GET /adminPage route. */
router.get("/adminPage", adminPageRoute);

/* GET /addCourse route. */
router.get("/addCourse", addCourseRoute);

/* GET /addCourse/:id route. */
router.get("/addCourse/:id", addRoute);

/* GET /courses route. */
router.get("/courses", isloggedIn, coursesRoute);

/* GET /myclass/:id route. */
router.get("/myclass/:id", isloggedIn, myclassRoute);

/* GET /myclass route. */
router.get("/myclass", isloggedIn, classlinkRoute);

/* GET /review page. */
router.get("/review", isloggedIn, reviewRoute);

/* GET /profile page. */
router.get("/profile", isloggedIn, profileRoute);

/* GET /delprofile/:username page. */
router.get("/delprofile/:username", isloggedIn, delprofileRoute);

/* GET /signup page. */
router.get("/signup", signupRoute);

/* GET /signin page. */
router.get("/signin", signin);

/* GET /like/:id page. */
router.get("/like/:id", isloggedIn, postlikeRoute);

/* GET /dislike/:id page. */
router.get("/dislike/:id", isloggedIn, postdislikeRoute);

/* GET /delete/:id page. */
router.get("/delete/:id", isloggedIn, postdeleteRoute);

/* GET /editprofile/:username page. */
router.get("/editprofile/:username", isloggedIn, function (req, res, next) {
  User.findOne({
    username: req.params.username,
  })
    .then((user) =>
      res.render("sections/editprofile", {
        user,
        loggedIn: req.user ? true : false,
        extra: false,
      })
    )
    .catch((err) => res.send(err));
});

/* GET /reset page. */
router.get("/reset", isloggedIn, function (req, res, next) {
  User.findOne({
    username: req.session.passport.user,
  })
    .then((user) =>
      res.render("sections/resetpassword", {
        user,
        loggedIn: req.user ? true : false,
        extra: false,
      })
    )
    .catch((err) => res.send(err));
});

/* GET /forgetpassword page. */
router.get("/forgetpassword", function (req, res, next) {
  res.render("sections/forgetpassword", {
    loggedIn: req.user ? true : false,
    extra: false,
  });
});

/* GET /logout page. */
router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect("/");
}

module.exports = router;







//----------------------------------------GOOGLE AUTH-------------------------------------------------

// router.get('/googlelogin',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
// console.log(req.user);
//     const { name, given_name, family_name, email } = req.user._json;
//     const newUser = new User({
//       username: given_name+'_'+family_name,
//       email,
//       name,

//     });

//     User.register(newUser, given_name)
//         .then(userCreated => {
//           res.redirect(`/editprofile/${userCreated.username}`);
//           })
//         .catch(err => res.send(err));

//   });
