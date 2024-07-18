const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000' // Reemplaza con el dominio de tu frontend
}));

// Importar Rutas
const newsRouter = require('./routes/news');
const resultsRouter = require('./routes/results');
const syncRouter = require('./routes/sync'); // Nueva ruta para sincronización histórica

// Usar Rutas
app.use('/news', newsRouter);
app.use('/results', resultsRouter);
app.use('/sync', syncRouter); // Usar la nueva ruta

// Sample Route
app.get('/', (req, res) => {
  res.send('Football News App Backend');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
