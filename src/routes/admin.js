const express = require('express');
const router = express.Router();

const AdminCtrl = require('../controllers/admin');
const AuthCtrl = require('../controllers/auth');

router.get('/users', AuthCtrl.onlyAuthUser, AdminCtrl.getUsers);

module.exports = router;
