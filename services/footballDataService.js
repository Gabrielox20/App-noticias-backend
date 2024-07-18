const axios = require('axios');
const Match = require('../models/matches');

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4/';

const syncHistoricalData = async (leagueId, seasons) => {
  try {
    for (const season of seasons) {
      console.log("liga: ",leagueId)
      console.log("año: ",season)

      const response = await axios.get(`${BASE_URL}competitions/${leagueId}/matches`, {
        headers: { 'X-Auth-Token': API_KEY },
        params: { season: season }
      });

      const matches = response.data.matches;
      console.log(matches)

      for (const match of matches) {
        const matchData = {
          area: {
            id: match.area.id,
            name: match.area.name,
            code: match.area.code,
            flag: match.area.flag
          },
          season: {
            id: match.season.id,
            startDate: new Date(match.season.startDate),
            endDate: new Date(match.season.endDate),
            currentMatchday: match.season.currentMatchday,
            winner: match.season.winner ? {
              id: match.season.winner.id,
              name: match.season.winner.name,
              shortName: match.season.winner.shortName,
              tla: match.season.winner.tla,
              crest: match.season.winner.crest,
              address: match.season.winner.address,
              website: match.season.winner.website,
              founded: match.season.winner.founded,
              clubColors: match.season.winner.clubColors,
              venue: match.season.winner.venue,
              lastUpdated: new Date(match.season.winner.lastUpdated)
            } : null
          },
          fixtureId: match.id,
          year_competition: season,
          id_competition: match.competition.id,
          name_competition: match.competition.name,
          code_competition: match.competition.code,
          type_competition: match.competition.type,
          emblem_competition: match.competition.emblem,
          utcDate: new Date(match.utcDate),
          status: match.status,
          matchday: match.matchday,
          stage: match.stage,
          group: match.group,
          lastUpdated: new Date(match.lastUpdated),
          homeTeam: {
            id: match.homeTeam.id,
            name: match.homeTeam.name,
            shortName: match.homeTeam.shortName,
            tla: match.homeTeam.tla,
            crest: match.homeTeam.crest
          },
          awayTeam: {
            id: match.awayTeam.id,
            name: match.awayTeam.name,
            shortName: match.awayTeam.shortName,
            tla: match.awayTeam.tla,
            crest: match.awayTeam.crest
          },
          score: {
            winner: match.score.winner,
            duration: match.score.duration,
            fullTime: {
              home: match.score.fullTime.home,
              away: match.score.fullTime.away
            },
            halfTime: {
              home: match.score.halfTime.home,
              away: match.score.halfTime.away
            }
          },
          odds: {
            msg: match.odds.msg
          }
          
        };


        await Match.findOneAndUpdate({ fixtureId: matchData.fixtureId }, matchData, { upsert: true });
      }
    }

    return { message: 'Historical data synchronized successfully' };
  } catch (error) {
    console.error('Error syncing historical data:', error);
    throw error;
  }
};

module.exports = {
  syncHistoricalData
};
