const express = require('express');
const router = express.Router();

const ApiCtrl = require('../controllers/api');

router.get('/', ApiCtrl.getIndex);
router.get('/meta', ApiCtrl.getMeta);



module.exports = router;
