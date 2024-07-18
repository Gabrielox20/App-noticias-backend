const axios = require('axios');
require('dotenv').config();

const leagues = [
  { code: 'PL', name: 'Premier League' },
  { code: 'PD', name: 'LaLiga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'FL1', name: 'Ligue 1' },
  { code: 'BSA', name: 'Brasileirao' },
];

const syncNews = async () => {
  try {
    for (const league of leagues) {
      const response = await axios.get(`https://app-noticias-backend.onrender.com/news/scrape-and-save`, {
        params: { league: league.name }
      });
      console.log(`News for ${league.name} scraped and saved:`, response.data.message);
    }
  } catch (error) {
    console.error('Error syncing news:', error.message);
  }
};

module.exports = syncNews;
