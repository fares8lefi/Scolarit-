const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

/* GET users listing. */
router.post('/invite', userController.inviteUser);
router.post('/signup', userController.singup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
