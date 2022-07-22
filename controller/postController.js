const User = require("../model/userSchema");
const Post = require("../model/postSchema");
const Course = require("../model/courseSchema");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./utility/multimedia").single("avatar");
const adminUpload = require("./utility/adminMulti").single("pic");

passport.use(new localStrategy(User.authenticate()));

// POST registerRoute
exports.registerRoute = (req, res, next) => {
  const newUser = new User({
      username: req.body.username,
      email: req.body.email
  });
  User.register(newUser, req.body.password)
      .then(userCreated => {
          passport.authenticate('local')(req, res, () => {
              req.logOut();
              res.redirect('/signin');
            //   res.redirect(`/editprofile/${req.body.username}`)
              // res.render('sections/editprofile', {userCreated});
          });
      })
      .catch(err => res.send(err));
}

// POST updateRoute
exports.updateRoute = (req, res, next) => {
  const {
      username,
      name,
      email,
      address,
      contact,
      about,
      gender
  } = req.body;
  const updatedProfile = {
      username,
      name,
      email,
      address,
      contact,
      about,
      gender
  };

  User.findOneAndUpdate({
          username: req.params.username
      }, {
          $set: updatedProfile
      }, {
          new: true
      })
      .then((revisedUser) => {
          req.user ? res.redirect(req.headers.referer) : res.redirect('/signin')
      })

      .catch(err => res.send(err));
}

// POST signinRoute
exports.signinRoute = passport.authenticate('local', {
  successRedirect: '/courses',
  failureRedirect: '/'
}, ),
function (req, res, next) {};

// POST signinRoute
exports.adminSigninRoute = passport.authenticate('local', {
  successRedirect: '/adminPage',
  failureRedirect: '/'
}),
function (req, res, next) {};

// POST courseImgRoute
exports.courseImgRoute = (req, res, next) => {
  //  console.log(req.user);
  adminUpload(req, res, err => {
      if (err) throw err;

      Course.findOne({
              _id: req.params.id
          })
          .then(data => {
              // console.log(data);
              // console.log(req.file);
              data.pic = req.file.filename;
              data.save();
              // console.log(data);
              if (req.body.oldpic !== 'bydefault.png') {
                  fs.unlinkSync(path.join(__dirname, '..', 'public', 'assets', 'adminCourse', req.body.oldpic));
              }
              res.render('sections/addCourse', {
                  data,
                  loggedIn: req.user ? true : false,
                  extra: false
              })
          })
          .catch(err => res.send(err))
  });
  // console.log(req.user);
}

// POST createCourseRoute
exports.createCourseRoute = (req, res, next) => {
  const {
      desc,
      title
  } = req.body;
  const firstUpdate = {
      desc,
      title
  };

  Course.findOneAndUpdate({
          _id: req.params.id
      }, {
          $set: firstUpdate
      }, {
          new: true
      })
      .then((revisedUser) => {
          res.redirect('/adminPage')
      })

      .catch(err => res.send(err));
}

// POST uploadingRoute
exports.uploadingRoute = (req, res, next) => {
  //  console.log(req.user);
  upload(req, res, err => {
      if (err) throw err;

      User.findOne({
              _id: req.params.id
          })
          .then(data => {
              // console.log(data);
              // console.log(req.file);
              data.avatar = req.file.filename;
              data.save();
              // console.log(data);
              if (req.body.oldavatar !== 'boy.png') {
                  fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', req.body.oldavatar));
              }
              
              res.redirect(`/editprofile/${data.username}`);
          })
          .catch(err => res.send(err))
  });
  // console.log(req.user);
}

// POST postRoute
exports.postRoute = (req, res, next) => {
  const newPost = new Post({
      postText: req.body.postText,
      postedBy: req.user
  })
  User.findOne({
          username: req.session.passport.user
      })
      .then((data) => {
          newPost.save();
          data.posts.push(newPost);
          data.save()
              .then(() => res.redirect('/profile'))
      })
      .catch(err => res.send(err));
}

// POST resetPasswordRoute
exports.resetPasswordRoute = (req, res, next) => {
  User.findOne({
          username: req.session.passport.user
      })
      .then(user =>
          user.changePassword(req.body.oldpassword, req.body.newpassword, (err) => {
              if (err) res.send(err);
              res.redirect('/signin');
          }))
      .catch(err => res.send(err));
}
