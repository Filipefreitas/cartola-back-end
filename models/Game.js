const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
    tournment:
    {
        type: String
        , required: true
    }
    , tournmentRound:
    {
        type: Number
        , required: true
    }
    , cartolaRound:
    {
        type: Number
        , required: true
    }
    , cartolaMonth:
    {
        type: Number
        , required: true
    }
    , gameDate: 
    { 
        type: Date
        , required: true
    }
    , homeTeam: 
    { 
        type: String 
        , required: true
    }
    , awayTeam: 
    { 
        type: String
        , required: true
    }
    , isFisrtHistGame:
    {
        type: String
    }
    , homeScore:
    { 
        type: Number
    }
    , awayScore:
    { 
        type: Number
    }
    , date:
    {
        type: Date
        , default: Date.now
    }
    , percPointsHome:
    {
        type: Number
    }
    , percPointsAway:
    {
        type: Number
    }
    , percDiff:
    {
        type: Number
    }
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;