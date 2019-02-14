const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//render login page
router.get("/login", ensureLogin.ensureLoggedOut(), (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

//login user
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

//render signup page
router.get("/signup", ensureLogin.ensureLoggedOut(), (req, res, next) => {
  res.render("auth/signup");
});

//create new user
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass
    });

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

//render edit page
router.get("/edit", ensureLogin.ensureLoggedIn("login"), (req, res, next) => {
  User.findById(req.session.passport.user)
    .then(userData => res.render("auth/edit", { user: userData }))
    .catch(error => console.log(error))
})

//edit users
router.post('/:id/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.params.id == req.session.passport.user) {
    let { username, email, password } = req.body
    if (password === "") {
      // User.findByIdAndUpdate(req.params.id, req.body)
      User.findByIdAndUpdate(req.params.id, { username, email })
        .then(success => {
          res.redirect("/")
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      // User.findByIdAndUpdate(req.params.id, req.body)
      User.findByIdAndUpdate(req.params.id, req.body)
        .then(success => {
          res.redirect("/")
        })
        .catch(error => {
          console.log(error)
        })
    }

  }

});

//delete user
router.post("/:id/delete", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.params.id === req.session.passport.user) {
    User.findByIdAndDelete(req.params.id)
      .then(res.redirect("/"))
      .catch(error => console.log(error))
  }
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/github", passport.authenticate("github"));
router.get("/github/callback", passport.authenticate("github", {
  successRedirect: "/",
  failureRedirect: "/login"
}));


module.exports = router;
