const express = require('express');
const multer = require('multer');
const { postPredict, getPredictionHistories } = require('./predict.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to keep files in memory

router.post('/cost', upload.array('image'), postPredict); // 'images' is the field name for the files

router.get('/history', getPredictionHistories)
module.exports = router;
