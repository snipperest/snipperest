require("dotenv").config()
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');


passport.use(new GithubStrategy({
  // passReqToCallback: true,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.HOST}/auth/github/callback`
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile)
  User.findOne({ GitHubId: profile.id })
    .then(user => {
      console.log(profile)
      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        GitHubId: profile.id,
        //photo: profile.photo,
        username: profile.username,
        email: profile.email
      });

      newUser.save()
        .then(user => {
          done(null, newUser);
        })
    })
    .catch(error => {
      done(error)
    })

}));



