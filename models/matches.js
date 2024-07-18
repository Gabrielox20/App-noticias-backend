const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  area: {
    id: Number,
    name: String,
    code: String,
    flag: String
  },
  season: {
    id: Number,
    startDate: Date,
    endDate: Date,
    currentMatchday: Number,
    winner: {
      id: Number,
      name: String,
      shortName: String,
      tla: String,
      crest: String,
      address: String,
      website: String,
      founded: Number,
      clubColors: String,
      venue: String,
      lastUpdated: Date
    }
  },
  fixtureId: { type: Number, required: true, unique: true },
  id_competition: Number,
  year_competition: Number,
  name_competition: String,
  code_competition: String,
  type_competition: String,
  emblem_competition: String,
  utcDate: Date,
  status: String,
  matchday: Number,
  stage: String,
  group: String,
  lastUpdated: Date,
  homeTeam: {
    id: Number,
    name: String,
    shortName: String,
    tla: String,
    crest: String
  },
  awayTeam: {
    id: Number,
    name: String,
    shortName: String,
    tla: String,
    crest: String
  },
  score: {
    winner: String,
    duration: String,
    fullTime: {
      home: Number,
      away: Number
    },
    halfTime: {
      home: Number,
      away: Number
    }
  },
  odds: {
    msg: String
  }
});

module.exports = mongoose.model('Matches', matchSchema);
