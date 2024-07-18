const axios = require('axios');
const cron = require('node-cron');

const BASE_URL = 'https://app-noticias-backend.onrender.com/sync/sync-historical';

const leagues = [
  //{ code: 'WC', id: '2013' },
  //{ code: 'EC', id: '2009' },
  //{ code: 'CL', id: '2001' },
  //{ code: 'BL1', id: '2002' },
  //{ code: 'DED', id: '2003' },
  //{ code: 'PD', id: '2005' },
  //{ code: 'FL1', id: '2006' },
  //{ code: 'ELC', id: '2007' },
  //{ code: 'PPL', id: '2008' },
  //{ code: 'SA', id: '2010' },
  //{ code: 'PL', id: '2011' },
  //{ code: 'CLI', id: '2012' },
  { code: 'BSA', id: '2004' },
];

const seasons = [2024];

const syncData = async () => {
  for (const league of leagues) {
    try {
      for (const season of seasons) {
        const response = await axios.post(BASE_URL, {
          leagueId: league.code,
          seasons: [season],
        });
      }
      console.log(`Successfully synced data for league: ${league.code}`);
    } catch (error) {
      console.error(`Error syncing data for league: ${league.code}`, error.message);
    }
  }
};

// Schedule the task to run every hour
cron.schedule('0 */1 * * *', () => {
  console.log('Running syncLeagues job...');
  syncData();
});

// Run the script immediately on startup
syncData();
