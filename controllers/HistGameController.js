const express = require('express')
const router = express.Router()
const histGameService = require("../services/HistGameService");

//Read all
router.get("/list", histGameService.getAllPastGames)

router.get("/matches", histGameService.getAllMatches)

module.exports = router