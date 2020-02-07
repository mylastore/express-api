const express = require('express');
const router = express.Router();

const ContactCtrl = require('../controllers/contact');
router.post('/', ContactCtrl.send);

module.exports = router;
