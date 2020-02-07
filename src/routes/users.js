const express = require('express');
const router = express.Router();

const UsersCtrl = require('../controllers/users');
const AuthCtrl = require('../controllers/auth');

router.get('/:id', AuthCtrl.onlyAuthUser, UsersCtrl.getCurrentUser);
router.get('/me/activity', AuthCtrl.onlyAuthUser, UsersCtrl.getUserActivity);
router.patch('/:id', AuthCtrl.onlyAuthUser, UsersCtrl.updateUser);

router.post('/register', UsersCtrl.register);
router.post('/login', UsersCtrl.login);
router.post('/logout', AuthCtrl.onlyAuthUser, UsersCtrl.logout);
router.post('/update', AuthCtrl.onlyAuthUser, UsersCtrl.updatePassword);
router.post('/delete', AuthCtrl.onlyAuthUser, UsersCtrl.deleteAccount);
router.post('/forgot', UsersCtrl.forgotPassword);
router.post('/reset/:token', UsersCtrl.processResetPassword)

router.patch('/meetups/favorite/:id', AuthCtrl.onlyAuthUser, UsersCtrl.addFavoriteMeetup);

module.exports = router;
