const express = require('express');
const multer = require('multer');
const postPredict = require('./predict.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to keep files in memory

router.post('/cost-prediction', upload.array('image'), postPredict); // 'images' is the field name for the files

module.exports = router;
