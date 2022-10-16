const gameModel = require("../models/Game.js");

//class Stats
class Stats {
    constructor(matches) {
        this.matches = matches;
        this.isValid = false;
        this.table = [];
        this.roundTable = [];
        this.runningTable = [];
        this.currentTempStats = [];
        this.masterStats = [];
        this.POINTS_WIN = 3;
        this.POINTS_DRAW = 1;
    }

    generateStandings() {
        this.matches.forEach(match => {
            const { _id, tournmentRound, cartolaRound, cartolaMonth, gameDate, homeTeam, awayTeam, isFisrtHistGame , homeScore, awayScore, date } = match;

            this.isValid = false;
            if (homeScore !== undefined && awayScore !== undefined) {
                this.isValid = true;
            }

            //add teams to the table
            const indexHome = this.table.findIndex(element => {
                if (element.team === homeTeam) {
                    return true;
                }
                return false;
            });

            if (indexHome === -1) {
                this.addToTable(homeTeam);
            }

            const indexAway = this.table.findIndex(element => {
                if (element.team === awayTeam) {
                    return true;
                }
                return false;
            });

            if (indexAway === -1) {
                this.addToTable(awayTeam);
            }

            //calculate won, lost, drawn and increased game played
            //calculate goalsScored, goalsAgainst, cleanSheets, and no goals
            if (this.isValid) {
                this.setResultsHome(homeTeam, match.homeScore, match.awayScore);
                this.setResultsAway(awayTeam, match.awayScore, match.homeScore);
            }
        });

        //all is done; return the table
        return this.table;
    }

    generateRoundStats() {
        this.matches.forEach(match => {
            const { _id, tournmentRound, cartolaRound, cartolaMonth, gameDate, homeTeam, awayTeam, homeScore, awayScore, date } = match;

            this.isValid = false;
            if (homeScore !== undefined && awayScore !== undefined) {
                this.isValid = true;
            }

            //add teams to the table
            const indexHome = this.table.findIndex(element => {
                if (element.team === homeTeam) {
                    return true;
                }
                return false;
            });

            if (indexHome === -1) {
                this.addToRoundTable(homeTeam, tournmentRound);
            }

            const indexAway = this.table.findIndex(element => {
                if (element.team === awayTeam) {
                    return true;
                }
                return false;
            });

            if (indexAway === -1) {
                this.addToRoundTable(awayTeam, tournmentRound);
            }

            //calculate won, lost, drawn and increased game played
            //calculate goalsScored, goalsAgainst, cleanSheets, and no goals
            if (this.isValid) {
                this.setRoundResultsHome(tournmentRound, homeTeam, match.homeScore, match.awayScore);
                this.setRoundResultsAway(tournmentRound, awayTeam, match.awayScore, match.homeScore);
            }
        });

        //all is done; return the table
        return this.roundTable;
    }

    generateRunningStats(roundTableParams){
        //number of objects in the round table
        const roundTableLen = Object.keys(roundTableParams).length

        //initialising the temp stats and the running table with all games of the first round
        for(let i=0; i < 20; i++)
        {
            this.currentTempStats.push(roundTableParams[i]);
            
            const game = {
                roundTeamKey: roundTableParams[i].roundTeamKey
                , round: roundTableParams[i].round
                , team: roundTableParams[i].team
                , points: roundTableParams[i].points
                , pointsHome: roundTableParams[i].pointsHome
                , pointsAway: roundTableParams[i].pointsAway
                , played: roundTableParams[i].played
                , playedHome: roundTableParams[i].playedHome
                , playedAway: roundTableParams[i].playedAway
                , won: roundTableParams[i].won
                , wonHome: roundTableParams[i].wonHome
                , wonAway: roundTableParams[i].wonAway
                , drawn: roundTableParams[i].drawn
                , drawnHome: roundTableParams[i].drawnHome
                , drawnAway: roundTableParams[i].drawnAway
                , lost: roundTableParams[i].lost
                , lostHome: roundTableParams[i].lostHome
                , lostAway: roundTableParams[i].lostAway
                , goalsScored: roundTableParams[i].goalsScored
                , goalsScoredHome: roundTableParams[i].goalsScoredHome
                , goalsScoredAway: roundTableParams[i].goalsScoredAway
                , goalsAgainst: roundTableParams[i].goalsAgainst
                , goalsAgainstHome: roundTableParams[i].goalsAgainstHome
                , goalsAgainstAway: roundTableParams[i].goalsAgainstAway
                , goalsDifference: roundTableParams[i].goalsDifference
                , goalsDifferenceHome: roundTableParams[i].goalsDifferenceHome
                , goalsDifferenceAway: roundTableParams[i].goalsDifferenceAway
                , cleanSheets: roundTableParams[i].cleanSheets
                , cleanSheetsHome: roundTableParams[i].cleanSheetsHome
                , cleanSheetsAway: roundTableParams[i].cleanSheetsAway
                , noGoals: roundTableParams[i].noGoals
                , noGoalsHome: roundTableParams[i].noGoalsHome
                , noGoalsAway: roundTableParams[i].noGoalsAway
                , percPoints: parseFloat(100 * roundTableParams[i].points / (this.POINTS_WIN * roundTableParams[i].played)).toFixed(2)
                , percPointsHome: parseFloat(100 * roundTableParams[i].pointsHome / (this.POINTS_WIN * roundTableParams[i].playedHome)).toFixed(2)
                , percPointsAway: parseFloat(100 * roundTableParams[i].pointsAway / (this.POINTS_WIN * roundTableParams[i].playedAway)).toFixed(2)
                , alreadyPlayed: true
            }

            this.runningTable.push(game); 

        }
        
        //reading the other objects starting from the 20th
        for(let i=20; i < roundTableLen; i++)
        {
            for(let j=0; j < 20; j++)
            {   
                //get the first object, and start looping to find a matching team in the temp stats table
                if(this.currentTempStats[j].team === roundTableParams[i].team)
                {                       
                    //update stats before pushing
                    const game = {
                        roundTeamKey: (this.currentTempStats[j].roundTeamKey = roundTableParams[i].roundTeamKey)
                        , round: (this.currentTempStats[j].round = roundTableParams[i].round)
                        , team: (this.currentTempStats[j].team = roundTableParams[i].team)
                        , points: (this.currentTempStats[j].points += roundTableParams[i].points)
                        , pointsHome: (this.currentTempStats[j].pointsHome += roundTableParams[i].pointsHome)
                        , pointsAway: (this.currentTempStats[j].pointsAway +=roundTableParams[i].pointsAway)
                        , played: (this.currentTempStats[j].played += roundTableParams[i].played)
                        , playedHome: (this.currentTempStats[j].playedHome += roundTableParams[i].playedHome)
                        , playedAway: (this.currentTempStats[j].playedAway += roundTableParams[i].playedAway)
                        , won: (this.currentTempStats[j].won += roundTableParams[i].won)
                        , wonHome: (this.currentTempStats[j].wonHome += roundTableParams[i].wonHome)
                        , wonAway: (this.currentTempStats[j].wonAway += roundTableParams[i].wonAway)
                        , drawn: (this.currentTempStats[j].drawn += roundTableParams[i].drawn)
                        , drawnHome: (this.currentTempStats[j].drawnHome += roundTableParams[i].drawnHome)
                        , drawnAway: (this.currentTempStats[j].drawnAway += roundTableParams[i].drawnAway)
                        , lost: (this.currentTempStats[j].lost += roundTableParams[i].lost)
                        , lostHome: (this.currentTempStats[j].lostHome += roundTableParams[i].lostHome)
                        , lostAway: (this.currentTempStats[j].lostAway += roundTableParams[i].lostAway)
                        , goalsScored: (this.currentTempStats[j].goalsScored += roundTableParams[i].goalsScored)
                        , goalsScoredHome: (this.currentTempStats[j].goalsScoredHome += roundTableParams[i].goalsScoredHome)
                        , goalsScoredAway: (this.currentTempStats[j].goalsScoredAway += roundTableParams[i].goalsScoredAway)
                        , goalsAgainst: (this.currentTempStats[j].goalsAgainst += roundTableParams[i].goalsAgainst)
                        , goalsAgainstHome: (this.currentTempStats[j].goalsAgainstHome += roundTableParams[i].goalsAgainstHome)
                        , goalsAgainstAway: (this.currentTempStats[j].goalsAgainstAway += roundTableParams[i].goalsAgainstAway)
                        , goalsDifference: (this.currentTempStats[j].goalsDifference += roundTableParams[i].goalsDifference)
                        , goalsDifferenceHome: (this.currentTempStats[j].goalsDifferenceHome += roundTableParams[i].goalsDifferenceHome)
                        , goalsDifferenceAway: (this.currentTempStats[j].goalsDifferenceAway += roundTableParams[i].goalsDifferenceAway)
                        , cleanSheets: (this.currentTempStats[j].cleanSheets += roundTableParams[i].cleanSheets)
                        , cleanSheetsHome: (this.currentTempStats[j].cleanSheetsHome += roundTableParams[i].cleanSheetsHome)
                        , cleanSheetsAway: (this.currentTempStats[j].cleanSheetsAway += roundTableParams[i].cleanSheetsAway)
                        , noGoals: (this.currentTempStats[j].noGoals += roundTableParams[i].noGoals)
                        , noGoalsHome: (this.currentTempStats[j].noGoalsHome += roundTableParams[i].noGoalsHome)
                        , noGoalsAway: (this.currentTempStats[j].noGoalsAway += roundTableParams[i].noGoalsAway)
                        , percPoints: parseFloat(100 * this.currentTempStats[j].points / (this.POINTS_WIN * this.currentTempStats[j].played)).toFixed(2)
                        , percPointsHome: parseFloat(100 * this.currentTempStats[j].pointsHome / (this.POINTS_WIN * this.currentTempStats[j].playedHome)).toFixed(2)
                        , percPointsAway: parseFloat(100 * this.currentTempStats[j].pointsAway / (this.POINTS_WIN * this.currentTempStats[j].playedAway)).toFixed(2)
                        , alreadyPlayed: roundTableParams[i].alreadyPlayed
                    }

                    this.runningTable.push(game); 
                }
            }
        }

        //all is done; return the table
        return this.runningTable;
    }

    addToTable(team) {
        this.table.push(
        {
            team: team,
            points: 0,
            pointsHome: 0,
            pointsAway: 0,
            played: 0,
            playedHome: 0,
            playedAway: 0,
            won: 0,
            wonHome: 0,
            wonAway: 0,
            drawn: 0,
            drawnHome: 0,
            drawnAway: 0,
            lost: 0,
            lostHome: 0,
            lostAway: 0,
            goalsScored: 0,
            goalsScoredHome: 0,
            goalsScoredAway: 0,
            goalsAgainst: 0,
            goalsAgainstHome: 0,
            goalsAgainstAway: 0,
            goalsDifference: 0,
            goalsDifferenceHome: 0,
            goalsDifferenceAway: 0,
            cleanSheets: 0,
            cleanSheetsHome: 0,
            cleanSheetsAway: 0,
            noGoals: 0,
            noGoalsHome: 0,
            noGoalsAway: 0,
            percPoints: 0,
            percPointsHome: 0,
            percPointsAway: 0,
            sortingKey: ""
        });
    }

    addToRoundTable(team, tournmentRound) {
        this.roundTable.push(
        {
            roundTeamKey: team + "_" + tournmentRound,
            round: tournmentRound,
            team: team,
            points: 0,
            pointsHome: 0,
            pointsAway: 0,
            played: 0,
            playedHome: 0,
            playedAway: 0,
            won: 0,
            wonHome: 0,
            wonAway: 0,
            drawn: 0,
            drawnHome: 0,
            drawnAway: 0,
            lost: 0,
            lostHome: 0,
            lostAway: 0,
            goalsScored: 0,
            goalsScoredHome: 0,
            goalsScoredAway: 0,
            goalsAgainst: 0,
            goalsAgainstHome: 0,
            goalsAgainstAway: 0,
            goalsDifference: 0,
            goalsDifferenceHome: 0,
            goalsDifferenceAway: 0,
            cleanSheets: 0,
            cleanSheetsHome: 0,
            cleanSheetsAway: 0,
            noGoals: 0,
            noGoalsHome: 0,
            noGoalsAway: 0,
        });
    }

    setResultsHome(homeTeam, homeScore, awayScore) {
        var indexHome = this.table.findIndex(el => el.team === homeTeam);

        if (indexHome !== -1) {
            //game played
            this.table[indexHome].played++;
            this.table[indexHome].playedHome++;
        
            //results
            if (homeScore > awayScore) {
                this.table[indexHome].won++;
                this.table[indexHome].wonHome++;
                this.table[indexHome].points += this.POINTS_WIN;
                this.table[indexHome].pointsHome += this.POINTS_WIN;
            }
            else if (homeScore < awayScore) {
                this.table[indexHome].lost++;
                this.table[indexHome].lostHome++;
            }

            else {
                this.table[indexHome].drawn++;
                this.table[indexHome].drawnHome++;
                this.table[indexHome].points += this.POINTS_DRAW;
                this.table[indexHome].pointsHome += this.POINTS_DRAW;
            }

            //goals
            this.table[indexHome].goalsScored += homeScore;
            this.table[indexHome].goalsScoredHome += homeScore;
            this.table[indexHome].goalsAgainst += awayScore;
            this.table[indexHome].goalsAgainstHome += awayScore;
            this.table[indexHome].goalsDifference += (homeScore - awayScore);
            this.table[indexHome].goalsDifferenceHome += (homeScore - awayScore);

            //no goals
            if (homeScore === 0) {
                this.table[indexHome].noGoals++;
                this.table[indexHome].noGoalsHome++;
            }

            //clean sheets
            if (awayScore === 0) {
                this.table[indexHome].cleanSheets++;
                this.table[indexHome].cleanSheetsHome++;
            }

            //perc points
            this.table[indexHome].percPointsHome = parseFloat(100 * this.table[indexHome].pointsHome / (this.POINTS_WIN * this.table[indexHome].playedHome)).toFixed(2);
            this.table[indexHome].percPoints = parseFloat(100 * this.table[indexHome].points / (this.POINTS_WIN * this.table[indexHome].played)).toFixed(2);

            //sortingKey
            this.table[indexHome].sortingKey =
                parseInt(100 * this.table[indexHome].points)
                + parseFloat(this.table[indexHome].won)
                + parseFloat(0.01 * this.table[indexHome].goalsDifference)
                + parseFloat(0.0001 * this.table[indexHome].goalsScored);
        }
    }

    setResultsAway(awayTeam, awayScore, homeScore) {
        var indexAway = this.table.findIndex(el => el.team === awayTeam);

        if (indexAway !== -1) {
            //game played
            this.table[indexAway].played++;
            this.table[indexAway].playedAway++;

            // game results
            if (homeScore > awayScore) {
                this.table[indexAway].lost++;
                this.table[indexAway].lostAway++;
            }
            else if (homeScore < awayScore) {
                this.table[indexAway].won++;
                this.table[indexAway].wonAway++;
                this.table[indexAway].points += this.POINTS_WIN;
                this.table[indexAway].pointsAway += this.POINTS_WIN;
            }

            else {
                this.table[indexAway].drawn++;
                this.table[indexAway].drawnAway++;
                this.table[indexAway].points += this.POINTS_DRAW;
                this.table[indexAway].pointsAway += this.POINTS_DRAW;
            }

            //goals
            this.table[indexAway].goalsScored += awayScore;
            this.table[indexAway].goalsScoredAway += awayScore;
            this.table[indexAway].goalsAgainst += homeScore;
            this.table[indexAway].goalsAgainstAway += homeScore;
            this.table[indexAway].goalsDifference += (awayScore - homeScore);
            this.table[indexAway].goalsDifferenceAway += (awayScore - homeScore);

            if (awayScore === 0) {
                this.table[indexAway].noGoals++;
                this.table[indexAway].noGoalsAway++;
            }

            if (homeScore === 0) {
                this.table[indexAway].cleanSheets++;
                this.table[indexAway].cleanSheetsAway++;
            }

            //percentual points
            this.table[indexAway].percPointsAway = parseFloat(100 * this.table[indexAway].pointsAway / (this.POINTS_WIN * this.table[indexAway].playedAway)).toFixed(2);
            this.table[indexAway].percPoints = parseFloat(100 * this.table[indexAway].points / (this.POINTS_WIN * this.table[indexAway].played)).toFixed(2);

            //sortingKey
            this.table[indexAway].sortingKey =
                parseFloat(100 * this.table[indexAway].points)
                + parseFloat(this.table[indexAway].won)
                + parseFloat(0.01 * this.table[indexAway].goalsDifference)
                + parseFloat(0.0001 * this.table[indexAway].goalsScored);
        }
    }

    setRoundResultsHome(tournmentRound, homeTeam, homeScore, awayScore) {
        var indexKey = homeTeam + "_" + tournmentRound;
        var indexHome = this.roundTable.findIndex(el => el.roundTeamKey === indexKey);

        if (indexHome !== -1) {
            //game played
            this.roundTable[indexHome].alreadyPlayed = true;
            this.roundTable[indexHome].played++;
            this.roundTable[indexHome].playedHome++;
        
            //results
            if (homeScore > awayScore) {
                this.roundTable[indexHome].won++;
                this.roundTable[indexHome].wonHome++;
                this.roundTable[indexHome].points += this.POINTS_WIN;
                this.roundTable[indexHome].pointsHome += this.POINTS_WIN;
            }
            else if (homeScore < awayScore) {
                this.roundTable[indexHome].lost++;
                this.roundTable[indexHome].lostHome++;
            }

            else {
                this.roundTable[indexHome].drawn++;
                this.roundTable[indexHome].drawnHome++;
                this.roundTable[indexHome].points += this.POINTS_DRAW;
                this.roundTable[indexHome].pointsHome += this.POINTS_DRAW;
            }

            //goals
            this.roundTable[indexHome].goalsScored += homeScore;
            this.roundTable[indexHome].goalsScoredHome += homeScore;
            this.roundTable[indexHome].goalsAgainst += awayScore;
            this.roundTable[indexHome].goalsAgainstHome += awayScore;
            this.roundTable[indexHome].goalsDifference += (homeScore - awayScore);
            this.roundTable[indexHome].goalsDifferenceHome += (homeScore - awayScore);

            //no goals
            if (homeScore === 0) {
                this.roundTable[indexHome].noGoals++;
                this.roundTable[indexHome].noGoalsHome++;
            }

            //clean sheets
            if (awayScore === 0) {
                this.roundTable[indexHome].cleanSheets++;
                this.roundTable[indexHome].cleanSheetsHome++;
            }
        }
    }

    setRoundResultsAway(tournmentRound, awayTeam, awayScore, homeScore) {
        var indexKey = awayTeam + "_" + tournmentRound;
        var indexAway = this.roundTable.findIndex(el => el.roundTeamKey === indexKey);

        if (indexAway !== -1) {
            //game played
            this.roundTable[indexAway].alreadyPlayed = true;
            this.roundTable[indexAway].played++;
            this.roundTable[indexAway].playedAway++;

            // game results
            if (homeScore > awayScore) {
                this.roundTable[indexAway].lost++;
                this.roundTable[indexAway].lostAway++;
            }
            else if (homeScore < awayScore) {
                this.roundTable[indexAway].won++;
                this.roundTable[indexAway].wonAway++;
                this.roundTable[indexAway].points += this.POINTS_WIN;
                this.roundTable[indexAway].pointsAway += this.POINTS_WIN;
            }

            else {
                this.roundTable[indexAway].drawn++;
                this.roundTable[indexAway].drawnAway++;
                this.roundTable[indexAway].points += this.POINTS_DRAW;
                this.roundTable[indexAway].pointsAway += this.POINTS_DRAW;
            }

            //goals
            this.roundTable[indexAway].goalsScored += awayScore;
            this.roundTable[indexAway].goalsScoredAway += awayScore;
            this.roundTable[indexAway].goalsAgainst += homeScore;
            this.roundTable[indexAway].goalsAgainstAway += homeScore;
            this.roundTable[indexAway].goalsDifference += (awayScore - homeScore);
            this.roundTable[indexAway].goalsDifferenceAway += (awayScore - homeScore);

            if (awayScore === 0) {
                this.roundTable[indexAway].noGoals++;
                this.roundTable[indexAway].noGoalsAway++;
            }

            if (homeScore === 0) {
                this.roundTable[indexAway].cleanSheets++;
                this.roundTable[indexAway].cleanSheetsAway++;
            }
        }
    }

    addPercPoints(games, runningStats){
        
        for(let i=0; i < games.length; i++)
        {
            const homeKey = games[i].homeTeam + "_" + games[i].tournmentRound;
            const awayKey = games[i].awayTeam + "_" + games[i].tournmentRound;
            
            for(let j=0; j < runningStats.length; j++)
            {
                if(runningStats[j].roundTeamKey === homeKey)
                {   
                    games[i].percPointsHome = runningStats[j].percPointsHome
                }

                if(runningStats[j].roundTeamKey === awayKey)
                {
                    games[i].percPointsAway = runningStats[j].percPointsAway
                    games[i].percDiff = (games[i].percPointsHome - games[i].percPointsAway).toFixed(2)
                    this.masterStats.push(games[i])
                }
            } 
        }

        return this.masterStats;
    }    
}

//get all games
exports.getAllGames = async (req,res)=>{    
    try{        
        const games = await gameModel.find({})
        
        //sorting by round and then game date
        const sortedGames = games.sort((a, b) => {
            if(a.tournmentRound > b.tournmentRound) return 1
            if(a.tournmentRound < b.tournmentRound) return -1
            if(a.gameDate < b.gameDate) return -1
            if(a.gameDate < b. gameDate) return -1
        }); 

            res.json({
                games: "A list of all games"
                , totalGames: sortedGames.length
                , data: sortedGames
            })
        } catch(err) {
            res.status(500).json({
            message: err    
        })
    }  
};      

//generate standings table
exports.generateStandings = async (req,res)=>{    
    try{        
        const games = await gameModel.find({})
        const league = new Stats(games);
        const stats = league.generateStandings();

        const sortStats = stats.sort((a, b) => {
            return b.sortingKey - a.sortingKey;
        });
                
            res.json({
                message: "Generate Standings"
                , data: sortStats
            })
        } catch(err) {
            res.status(500).json({
            message: err    
        })
    }  
};

//generate round by round stats
exports.generateRoundStats = async (req,res)=>{    
    try{        
        const games = await gameModel.find({})

        const sortedGames = games.sort((a, b) => {
            return a.tournmentRound - b.tournmentRound;
        });

        const league = new Stats(sortedGames);
        const stats = league.generateRoundStats();

        //filter only games that have been played. Not used, filter has been moved to the front-end when loading component
        /*
        const filteredRoundStats = stats.filter((item) => {
            return item.alreadyPlayed === true;
        })
        */

            res.json({
                message: "Round stats"
                , data: stats
            })
        } catch(err) {
            res.status(500).json({
            message: err    
        })
    }  
};
    
//generate running stats by team for each round played 
exports.generateRunningStats = async (req,res)=>{    
    try{        
        const games = await gameModel.find({})
        
        const sortedGames = games.sort((a, b) => {
            return a.tournmentRound - b.tournmentRound;
        });

        const league = new Stats(sortedGames);
        const runningStats = league.generateRunningStats(league.generateRoundStats());

            res.json({
                message: "Running stats"
                , data: runningStats
            })
        } catch(err) {
            res.status(500).json({
            message: err    
        })
    }  
};

//used to add the percentual points difference performnace into the game object. Info displayed in the month map page.
exports.generatePercDiff = async (req,res)=>{    
    try{       
        const games = await gameModel.find({})
        
        const sortedGames = games.sort((a, b) => {
            return a.tournmentRound - b.tournmentRound;
        });

        const league = new Stats(sortedGames);
        const runningStats = league.generateRunningStats(league.generateRoundStats());
        const allStats = league.addPercPoints(games, runningStats)

            res.json({
                message: "All stats"
                , data: allStats
            })
        } catch(err) {
            res.status(500).json({
            message: err    
        })
    }  
};

