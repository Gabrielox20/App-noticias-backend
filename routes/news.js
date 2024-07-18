const express = require('express');
const router = express.Router();
const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const News = require('../models/news');

const API_KEY = process.env.NEWS_API_KEY; 

const { exec } = require('child_process');

// Ruta para realizar el web scraping y guardar los datos en la base de datos
router.get('/scrape-and-save', (req, res) => {
  const league = req.query.league || 'LaLiga';
  exec(`python scrape_news.py "${league}"`, async (error, stdout, stderr) => {
      if (error) {
          console.error(`Error executing Python script: ${stderr}`);
          res.status(500).json({ message: 'Error executing Python script', error: stderr });
          return;
      }
      try {
          const newsData = JSON.parse(stdout).filter(article => article && article.title !== 'Error fetching article');
          
          // Guardar las noticias en la base de datos
          for (const article of newsData) {
              const existingArticle = await News.findOne({ url: article.url });
              if (!existingArticle) {
                  const newsArticle = new News({
                      ...article,
                      league
                  });
                  await newsArticle.save();
              }
          }
          
          res.json({ message: 'News articles scraped and saved successfully' });
      } catch (parseError) {
          console.error(`Error parsing JSON: ${parseError.message}`);
          res.status(500).json({ message: 'Error parsing JSON', error: parseError.message });
      }
  });
});
  // Ruta para obtener las noticias desde la base de datos
router.get('/', async (req, res) => {
    try {
      const league = req.query.league || 'LaLiga';
      const articles = await News.find({ league });
      res.json(articles);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });




// Crear una nueva noticia
router.post('/', async (req, res) => {
    const news = new News({
        title: req.body.title,
        image: req.body.image,
        link: req.body.link
    });

    try {
        const newNews = await news.save();
        res.status(201).json(newNews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Middleware para obtener noticia por ID
async function getNews(req, res, next) {
    let news;
    try {
        news = await News.findById(req.params.id);
        if (news == null) {
            return res.status(404).json({ message: 'No se encontró la noticia' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.news = news;
    next();
}

// Obtener una noticia específica
router.get('/:id', getNews, (req, res) => {
    res.json(res.news);
});

// Actualizar una noticia
router.patch('/:id', getNews, async (req, res) => {
    if (req.body.title != null) {
        res.news.title = req.body.title;
    }
    if (req.body.image != null) {
        res.news.image = req.body.image;
    }
    if (req.body.link != null) {
        res.news.link = req.body.link;
    }

    try {
        const updatedNews = await res.news.save();
        res.json(updatedNews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar una noticia
router.delete('/:id', getNews, async (req, res) => {
    try {
        await res.news.remove();
        res.json({ message: 'Noticia eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
