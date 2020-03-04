const express = require('express');
const router = express.Router();

const QuotesCtrl = require('../controllers/quotes');
const AuthCtrl = require('../controllers/auth');

router.get('/:id', AuthCtrl.onlyAuthUser, QuotesCtrl.getQuote);
router.get('/all/:page', AuthCtrl.onlyAuthUser, QuotesCtrl.getQuotes);

router.post('/create', QuotesCtrl.create);
router.delete('/:id', AuthCtrl.onlyAuthUser, QuotesCtrl.delete);
router.patch('/:id', AuthCtrl.onlyAuthUser, QuotesCtrl.update);

module.exports = router;
