const express = require('express');
const router = express.Router();
const { syncHistoricalData } = require('../services/footballDataService');

const axios = require('axios');
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4/';

// Ruta para sincronizar datos históricos
router.post('/sync-historical', async (req, res) => {
    const { leagueId, seasons } = req.body;
    try {
      const result = await syncHistoricalData(leagueId, seasons);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

  router.get('/leagues', async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}competitions`, {
        headers: { 'X-Auth-Token': API_KEY }
      });
      const leagues = response.data.competitions;
      res.json(leagues);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
module.exports = router;
