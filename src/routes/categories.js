const express = require('express');
const router = express.Router();

const CategoriesCtrl = require('../controllers/categories');
const AuthCtrl = require('../controllers/auth');

router.get('', AuthCtrl.onlyAuthUser, CategoriesCtrl.getCategories);

module.exports = router;
