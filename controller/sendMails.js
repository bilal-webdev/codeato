const nodeMailer = require('nodemailer');
const User = require('../model/userSchema');
const Post = require('../model/postSchema');
const passport = require('passport');
const localStrategy = require('passport-local');
const {
  post
} = require('../app');
const upload = require('./utility/multimedia').single('avatar');

const mailKey = require('../app');

passport.use(new localStrategy(User.authenticate()));

// POST sendMailsRoute
exports.sendMailsRoute = (req, res, next) => {
  let password = Math.floor(Math.random() * 99999999);
  User.findOne({
    email: req.body.email
  }).
  then(user => {
    if (!user) return res.json({
      message: 'Email Address does not exist'
    });

    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailKey.MAIL_USER,
        pass: mailKey.MAIL_PASS,
      }
    });
    const mailOptions = {
      from: '"Codeato Coding School" <codeato1296@gmail.com>',
      to: req.body.email.trim(),
      subject: "Auto Generated Password by Codeato",
      text: `Your Password for Codeato account is "${password}".`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;

      user.setPassword(String(password), (err, user) => {
        if (err) throw err;
        user.save().
        then(() => res.redirect('/signin'));
      })
    });
  });
};