const axios = require('axios');
const cron = require('node-cron');
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

// Schedule the task to run every hour
cron.schedule('0 */1 * * *', () => {
    console.log('Running syncNews job...');
  syncNews();
});

// Run the script immediately on startup
syncNews();
