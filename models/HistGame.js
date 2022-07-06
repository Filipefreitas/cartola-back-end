const mongoose = require("mongoose");
const { Schema } = mongoose;

const HistGameSchema = new Schema({
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
    , gameDate: 
    { 
        type: Date
        , required: true
    }
    , gameTime: 
    { 
        type: Date
    }
    , stadium: 
    { 
        type: String
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
    , homeScore:
    { 
        type: Number
    }
    , awayScore:
    { 
        type: Number
    }
    , homeStats:
    {
        type: Object
    }
    , awayStats:
    {
        type: Object
    }
    , date:
    {
        type: Date
        , default: Date.now
    }
});

const HistGame = mongoose.model('HistGame', HistGameSchema);

module.exports = HistGame;