const express = require('express');
const { register } = require('./auth.controller');

const router = express.Router();

router.post('/register', register);

router.get('/', ()=> {
    return "halo"
})

module.exports = router;