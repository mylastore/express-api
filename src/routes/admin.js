const express = require('express');
const router = express.Router();

const AdminCtrl = require('../controllers/admin');
const AuthCtrl = require('../controllers/auth');

router.get('/users/:page', AuthCtrl.onlyAuthUser, AdminCtrl.getUsers);
router.get('/users/profile/:id', AuthCtrl.onlyAuthUser, AdminCtrl.getUser);
router.patch('/users/settings/:id', AuthCtrl.onlyAuthUser, AdminCtrl.postAdminSettings);   

module.exports = router;
