const express = require("express");
const passport = require('passport');
const router = express.Router();
const multer = require("multer")
const upload = multer({ dest: "./public/uploads" })
const Board = require("../models/Board");
const Snippet = require("../models/Snippet")
const ensureLogin = require("connect-ensure-login")

router.get("/", (req, res, next) => {
  Board.find()
    .populate("creator")
    .then(boards => res.render("board/all", { boards }))
    .catch(error => console.log(error))
})

router.get("/new", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("board/new")
})

router.post("/new", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  const newBoard = new Board({
    name: req.body.name,
    creator: req.user._id
  })

  newBoard.save()
    .then(() => res.redirect("/boards"))
    .catch(error => console.log(error))
})


router.get("/:id", (req, res, next) => {

  Board.findById(req.params.id)
    .populate("creator")
    .then(board => {
      Snippet.find({ board: req.params.id })
        .then(snippets => {
          res.render("board/view", { board, snippets })
        }
        )
        .catch(error => console.log(error))
    }
    )
    .catch(error => console.log(error))
})

router.get("/:id/edit", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  Board.findById(req.params.id)
    .populate("creator")
    .then(board => {
      if (board.creator._id != req.session.passport.user) {
        res.redirect("/boards")
      } else {
        res.render("board/edit", { board })
      }
    })
    .catch(error => console.log(error))
})

router.post("/:id/createdby/:creatorID/edit", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  if (req.params.creatorID == req.session.passport.user) {
    Board.findByIdAndUpdate(req.params.id, {
      name: req.body.name
    }).then(res.redirect("/boards/" + req.params.id))
      .catch(error => console.log(error))
  } else {
    res.redirect("/auth/login")
  }
})

router.post("/:id/:creatorID/delete", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  if (req.params.creatorID === req.session.passport.user) {
    Board.findByIdAndDelete(req.params.id)
      .then(() => {
        Snippet.deleteMany({ board: req.params.id })
          .then(msg => console.log("Yay! " + msg))
          .catch(error => console.log("Error! " + error))
        res.redirect("/boards")
      })
      .catch(error => console.log(error))
  } else {
    res.redirect("/auth/login")
  }
})

module.exports = router