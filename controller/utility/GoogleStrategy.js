// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.serializeUser((user, done)=> done(null, user));
// passport.deserializeUser((user, done)=> done(null, user));

// passport.use(new GoogleStrategy({
//     clientID: '650534363474-63k6errrcbqv2d2r2so62hgc7ghnfq9g.apps.googleusercontent.com',
//     clientSecret: 'L1Ioe4pYm8P_BPKJMksTXvZQ',
//     callbackURL: "http://localhost:3000/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     //   console.log(profile);
//    return done(null, profile);
//   }
// ));