const express = require('express')
const router = express.Router()
const gameService = require("../services/GameService");

//Read all
router.get("/list", gameService.getAllGames)

router.get("/standings", gameService.generateStandings)

router.get("/roundStats", gameService.generateRoundStats)

router.get("/runningStats", gameService.generateRunningStats);

router.get("/percDiff", gameService.generatePercDiff);

module.exports = router