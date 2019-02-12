const express = require("express");
const passport = require('passport');
const router = express.Router();
const multer = require("multer")
const upload = multer({ dest: "./public/uploads" })
const Board = require("../models/Board");
const ensureLogin = require("connect-ensure-login")



module.exports = router