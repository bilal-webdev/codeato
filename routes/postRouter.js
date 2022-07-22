var express = require("express");
var router = express.Router();
const {
  registerRoute,
  updateRoute,
  signinRoute,
  adminSigninRoute,
  courseImgRoute,
  createCourseRoute,
  uploadingRoute,
  postRoute,
  resetPasswordRoute,
} = require("../controller/postController");

const { sendMailsRoute } = require("../controller/sendMails");

/* POST /register route. */
router.post("/register", registerRoute);

/* POST /updated/:username route. */
router.post("/updated/:username", updateRoute);

/* POST /signin page. */
router.post("/signin", signinRoute);

router.post("/adminsignin", adminSigninRoute);

router.post("/courseImg/:id", courseImgRoute);

router.post("/createCourse/:id", createCourseRoute);

/* POST /uploading page. */
router.post("/uploading/:id", uploadingRoute);

/* POST /post page. */
router.post("/post", postRoute);

/* POST /resetpassword page. */
router.post("/resetpassword", resetPasswordRoute);

/* POST /resetpassword page. */
router.post("/sendmail", sendMailsRoute);

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
