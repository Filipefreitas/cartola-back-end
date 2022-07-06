const express = require('express')
const router = express.Router();
const generalService = require("../services/GeneralService.js");

//Route to direct user to home page
router.get("/", generalService.home);

//Not found route
router.get("*", generalService.notFound);

module.exports = router