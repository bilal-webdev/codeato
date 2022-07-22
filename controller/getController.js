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

// GET homeRoute
exports.homeRoute = (req, res, next) => {
  Course.find()
    .then((courses) => {
      res.render("index", {
        courses,
        loggedIn: false,
        extra: false,
      });
    })
    .catch((err) => res.send(err));
};

// GET adminRoute
exports.adminRoute = (req, res, next) => {
  res.render("sections/admin", {
    user: req.user,
    loggedIn: req.user ? true : false,
    extra: true,
  });
};

// GET adminPageRoute
exports.adminPageRoute = (req, res, next) => {
  // console.log(req.user);
  User.findOne({
    username: req.session.passport.user,
  })
    .populate("course")
    .exec((err, courses) => {
      // console.log(courses);
      res.render("sections/adminPage", {
        courses,
        user: req.user,
        loggedIn: req.user ? true : false,
        extra: false,
      });
    });
};

// GET addCourseRoute
exports.addCourseRoute = (req, res, next) => {
  const newCourse = new Course({
    desc: "",
    title: "",
  });
  User.findOne({
    username: req.session.passport.user,
  })
    .then((data) => {
      newCourse.save();
      data.course.push(newCourse);
      // console.log(newCourse);
      data.save().then(() => {
        res.redirect(`/addCourse/${newCourse._id}`);
      });
    })
    .catch((err) => res.send(err));
};

// GET addRoute
exports.addRoute = (req, res, next) => {
  Course.findOne({
    _id: req.params.id,
  })
    .then((data) => {
      res.render("sections/addCourse", {
        data,
        loggedIn: req.user ? true : false,
        extra: false,
      });
    })
    .catch((err) => res.send(err));
};

// GET coursesRoute
exports.coursesRoute = (req, res, next) => {
  User.findOne({
    username: req.session.passport.user,
  })
    .then((userdata) => {
      Course.find()
        .then((courses) => {
          res.render("sections/courses", {
            courses,
            userdata,
            user: req.user,
            loggedIn: req.user ? true : false,
            extra: false,
          });
        })
        .catch((err) => res.send(err));
    })
    .catch((err) => res.send(err));
  // console.log(req.user);
};

// GET myclassRoute
exports.myclassRoute = (req, res, next) => {
  var courseId = req.params.id;
  User.findOne({
    username: req.session.passport.user,
  })
    .then((data) => {
      data.course.push(courseId);
      data
        .save()
        .then((user) => {
          Course.findOne({
            _id: courseId,
          }).then((course) => {
            course.subscribedBy.push(user._id);
            course.save().then(() => {
              User.findOne({
                username: req.session.passport.user,
              })
                .populate("course")
                .exec((err, courses) => {
                  // console.log(courses);
                  res.render("sections/myclass", {
                    courses,
                    user: req.user,
                    loggedIn: req.user ? true : false,
                    extra: false,
                  });
                });
            });
          });
        })
        .catch((err) => res.send(err));
    })
    .catch((err) => res.send(err));
  // console.log(req.user);
};

// GET classlinkRoute
exports.classlinkRoute = (req, res, next) => {
  User.findOne({
    username: req.session.passport.user,
  })
    .populate("course")
    .exec((err, courses) => {
      console.log(courses);
      res.render("sections/myclass", {
        courses,
        user: req.user,
        loggedIn: req.user ? true : false,
        extra: false,
      });
    });
};

// GET reviewRoute
exports.reviewRoute = (req, res, next) => {
  Post.find()
    .populate("postedBy")
    .exec((err, posts) => {
      res.render("sections/review", {
        posts,
        user: req.user,
        loggedIn: req.user ? true : false,
        extra: false,
      });
    });
};

// GET profileRoute
exports.profileRoute = (req, res, next) => {
  //  console.log(req.user);
  User.findOne({
    username: req.session.passport.user,
  })
    .populate("posts")
    .exec((err, user) => {
      res.render("sections/profile", {
        user,
        loggedIn: req.user ? true : false,
        extra: false,
      });
    });
};

// GET delprofileRoute
exports.delprofileRoute = (req, res, next) => {
  User.findOneAndDelete({
    username: req.params.username,
  })
    .then((data) => {
      // console.log(data);
      if (data.avatar !== "boy.png") {
        fs.unlinkSync(
          path.join(__dirname, "..", "public", "images", data.avatar)
        );
      }
      let arr = data.posts;
      // console.log(arr);
      arr.forEach((el) => {
        Post.findOneAndDelete({
          _id: el,
        })
          .then(() => Post.save())
          .catch((err) => res.send(err));
      });
      res.redirect("/signin");
    })
    .catch((err) => res.send(err));
};

// GET signupRoute
exports.signupRoute = (req, res, next) => {
  res.render("sections/signup", {
    user: req.user,
    loggedIn: req.user ? true : false,
    extra: true,
  });
};

// GET signinRoute
exports.signin = (req, res, next) => {
  req.logOut();
  res.render("sections/signin", {
    user: req.user,
    loggedIn: req.user ? true : false,
    extra: true,
  });
};

// GET postlikeRoute
exports.postlikeRoute = (req, res, next) => {
  User.findOne({
    username: req.session.passport.user,
  })
    .then((loguser) =>
      Post.findOne({
        _id: req.params.id,
      })
        .then((likedPost) => {
          if (likedPost.like.indexOf(loguser._id) === -1) {
            if (likedPost.dislike.indexOf(loguser._id) >= 0) {
              let ind = likedPost.dislike.findIndex(
                (p) => p._id === loguser._id
              );
              likedPost.dislike.splice(ind, 1);
            }
            likedPost.like.push(loguser);
          }
          likedPost.save().then(() => res.redirect(req.headers.referer));
        })
        .catch((err) => res.send(err))
    )
    .catch((err) => res.send(err));
};

// GET postdislikeRoute
exports.postdislikeRoute = (req, res, next) => {
  User.findOne({
    username: req.session.passport.user,
  })
    .then((loguser) =>
      Post.findOne({
        _id: req.params.id,
      })
        .then((dislikedPost) => {
          if (dislikedPost.dislike.indexOf(loguser._id) === -1) {
            if (dislikedPost.like.indexOf(loguser._id) >= 0) {
              let ind = dislikedPost.like.findIndex(
                (p) => p._id === loguser._id
              );
              dislikedPost.like.splice(ind, 1);
            }
            dislikedPost.dislike.push(loguser);
          }
          dislikedPost.save().then(() => res.redirect(req.headers.referer));
        })
        .catch((err) => res.send(err))
    )
    .catch((err) => res.send(err));
};

// GET postdeleteRoute
exports.postdeleteRoute = (req, res, err) => {
  Post.findOneAndDelete({
    _id: req.params.id,
  })
    .then((data) => {
      User.findOne({
        username: req.session.passport.user,
      })
        .then((user) => {
          const index = user.posts.indexOf(data._id);
          user.posts.splice(index, 1);
          user.save();
        })
        .then(() => res.redirect("/profile"));
    })
    .catch((err) => res.send(err));
};
