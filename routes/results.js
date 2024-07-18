const express = require('express');
const router = express.Router();
const footballDataService = require('../services/footballDataService');
const Match = require('../models/matches');



// Ruta para obtener partidos de una liga específica por temporada
router.get('/competition/:leagueId/matches', async (req, res) => {
    try {
        const leagueId = req.params.leagueId;
        const year = parseInt(req.query.year);
        const matches = await Match.find({
            code_competition: leagueId,
            year_competition: year
        });
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener todos los resultados
router.get('/', async (req, res) => {
    try {
        const results = await Result.find();
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear un nuevo resultado
router.post('/', async (req, res) => {
    const result = new Result({
        match: req.body.match,
        result: req.body.result
    });

    try {
        const newResult = await result.save();
        res.status(201).json(newResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Middleware para obtener resultado por ID
async function getResult(req, res, next) {
    let result;
    try {
        result = await Result.findById(req.params.id);
        if (result == null) {
            return res.status(404).json({ message: 'No se encontró el resultado' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.result = result;
    next();
}

// Obtener un resultado específico
router.get('/:id', getResult, (req, res) => {
    res.json(res.result);
});

// Actualizar un resultado
router.patch('/:id', getResult, async (req, res) => {
    if (req.body.match != null) {
        res.result.match = req.body.match;
    }
    if (req.body.result != null) {
        res.result.result = req.body.result;
    }

    try {
        const updatedResult = await res.result.save();
        res.json(updatedResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un resultado
router.delete('/:id', getResult, async (req, res) => {
    try {
        await res.result.remove();
        res.json({ message: 'Resultado eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
