const express = require("express");
const passport = require('passport');
const router = express.Router();
const multer = require("multer")
const upload = multer({ dest: "./public/uploads" })
const Snippet = require("../models/Snippet");
const ensureLogin = require("connect-ensure-login")

router.get("/", (req, res, next) => {
  Snippet.find()
    .then(snippets => res.render("snippet/all", { snippets }))
    .catch(error => console.log(error))
})

router.get("/new", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("snippet/new")
})

router.post("/new", ensureLogin.ensureLoggedIn("/auth/login"), upload.single("image"), (req, res, next) => {
  const { title, language, code, description, source } = req.body
  let picPath
  let picName
  if (req.file) {
    picPath = `/uploads/${req.file.filename}`
    picName = req.file.originalname
  } else {
    picPath = ""
    picName = ""
  }
  const newSnippet = new Snippet({
    title,
    language,
    code,
    description,
    pic: {
      picPath,
      picName
    },
    source,
    creator: req.user._id
  })

  newSnippet.save(res.redirect("/"))
})

router.get("/:id", (req, res, next) => {
  Snippet.findById(req.params.id)
    .populate("creator")
    .then(snippet => res.render("snippet/view", { snippet }))
    .catch(error => console.log(error))
})

router.get("/:id/edit", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  Snippet.findById(req.params.id)
    .populate("creator")
    .then(snippet => {
      if (snippet.creator._id != req.session.passport.user) {
        res.redirect("/snippets")
      } else {
        res.render("snippet/edit", { snippet })
      }
    })
    .catch(error => console.log(error))
})

router.post("/:id/createdby/:creatorID/edit", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  if (req.params.creatorID == req.session.passport.user) {
    let { title, language, code, description, source } = req.body

    if (req.file) {
      let picPath = `/uploads/${req.file.filename}`
      let picName = req.file.originalname

      Snippet.findByIdAndUpdate(req.params.id, {
        title,
        language,
        code,
        description,
        pic: {
          picPath,
          picName
        },
        source,
      }).then(res.redirect("/snippets/" + req.params.id))
        .catch(error => console.log())
    } else {
      Snippet.findByIdAndUpdate(req.params.id, {
        title,
        language,
        code,
        description,
        source,
      }).then(res.redirect("/snippets/" + req.params.id))
        .catch(error => console.log())
    }
  }

})

//delete user
router.post("/:id/:creatorID/delete", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  if (req.params.creatorID === req.session.passport.user) {
    Snippet.findByIdAndDelete(req.params.id)
      .then(res.redirect("/snippets"))
      .catch(error => console.log(error))
  }
})


module.exports = router