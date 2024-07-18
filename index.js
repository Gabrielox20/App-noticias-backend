// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { execSync } = require('child_process');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONT // Reemplaza con el dominio de tu frontend
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

// Integrar syncLeagues.js y syncNews.js
// Verificar instalación de Python y pip
try {
  const pythonVersion = execSync('python --version');
  const pipVersion = execSync('pip --version');
  console.log('Python version:', pythonVersion.toString());
  console.log('Pip version:', pipVersion.toString());
} catch (error) {
  console.error('Error verificando la instalación de Python y pip:', error.message);
}
// Instalar dependencias de Python
try {
  execSync('pip install -r requirements.txt');
  console.log('Dependencias de Python instaladas');
} catch (error) {
  console.error('Error instalando dependencias de Python:', error.message);
}
require('./syncLeagues');
require('./syncNews');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
