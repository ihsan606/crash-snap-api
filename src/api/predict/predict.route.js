const express = require('express');
const multer = require('multer');
const { postPredict, getPredictionHistories, getPredictionByID, deletePreditionByID } = require('./predict.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 

router.post('/cost', upload.array('image'), postPredict); 

router.get('/', getPredictionHistories)

router.get('/:id/detail', getPredictionByID)

router.delete('/:id/delete', deletePreditionByID)

module.exports = router;
