const mongoose = require("mongoose");
const { Schema } = mongoose;

const StandingSchema = new Schema({
    points:
    {
        type: Number
        , required: true
    }
    , games:
    {
        type: Number
        , required: true
    }
    , wom: 
    { 
        type: Number
        , required: true
    }
    , drawn:
    { 
        type: Number
        , required: true
    }
    , lost:
    { 
        type: Number
        , required: true
    }
    , goalsFor:
    { 
        type: Number
        , required: true
    }
    , goalsAgainst:
    { 
        type: Number
        , required: true
    }
    , goalsDifference:
    { 
        type: Number
        , required: true
    }
    , cleanSheets:
    { 
        type: Number
        , required: true
    }
    , percentRecord:
    { 
        type: Number
        , required: true
    }
});

const Standing = mongoose.model('Standing', StandingSchema);

module.exports = Standing;