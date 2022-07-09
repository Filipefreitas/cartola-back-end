const histGameModel = require("../models/HistGame");

//class Stats
class HistStats {
    constructor(matches) {
        this.matches = matches;
        this.histTable = [];
    }

    generateHistMatches() {
        this.matches.forEach(match => {
            const { _id, tournment, tournmentRound, gameDate, homeTeam, awayTeam, homeScore, awayScore, date } = match;

            const matchKey = homeTeam + "_" + awayTeam;
            const countMatches = this.countMatchKey(matchKey);

            this.addToTable(gameDate, homeTeam, awayTeam, homeScore, awayScore, countMatches);
        });

        //all is done; return the table
        return this.histTable;
    }

    countMatchKey(matchKey)
    {
        return this.histTable.filter((obj) => obj.matchKey === matchKey).length;
    }
    
    addToTable(gameDate, homeTeam, awayTeam, homeScore, awayScore, countMatches) {
        
        const gameWinner = this.setResult(homeScore, awayScore);

        this.histTable.push(
        {
            matchKey: homeTeam + "_" + awayTeam
            , gameDate: gameDate
            , homeTeam: homeTeam
            , awayTeam: awayTeam
            , homeScore: homeScore
            , awayScore: awayScore
            , gameResult: homeScore + "-" + awayScore
            , gameWinner: gameWinner
            , countMatches: countMatches
        });
    }

    setResult(homeScore, awayScore)
    {
        let gameWinner = "";
        
        if(homeScore > awayScore)
        {
            return gameWinner = "home"
        }
        else if (homeScore < awayScore)
        {
            return gameWinner = "away"
        }
        else
        {
            return gameWinner = "drawn"
        }
    }
}

//get all past games
exports.getAllPastGames = (req,res)=>{
    histGameModel.find()
        .then(histGames=>{
            res.json({
                histGames: "A list of all past games"
                , totalGames: histGames.length
                , data: histGames
            })
        })
        .catch(err=>{
            res.status(500).json({
                message: err
            })
        })
};

//get all matches - format
exports.getAllMatches = async (req,res)=>{    
    try{        
        const games = await histGameModel.find({})
        const league = new HistStats(games);
        const stats = league.generateHistMatches();

        const sortStats = stats.sort((a, b) => {
            return b.gameDate - a.gameDate;
        });
                
            res.json({
                message: "All past games formatted"
                , totalGames: sortStats.length
                , data: sortStats
            })
        } catch(err) {
            res.status(500).json({
            message: err    
        })
    }  
};
