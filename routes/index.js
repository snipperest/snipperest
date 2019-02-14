const express = require('express');
const router  = express.Router();
const Snippet = require("../models/Snippet");
const Board = require("../models/Board");

/* GET home page */
router.get('/', (req, res, next) => {
  Snippet.find()
    .populate("board")
    .populate("creator")
    .then(snippets => res.render("index", { snippets }))
    .catch(error => console.log(error))

});

module.exports = router;
