var express = require('express');
var router = express.Router();
const userController= require('../Controllers/userController');
/* GET users listing. */
router.post('/invite', userController.inviteUser);
router.post('/signup', userController.singup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
module.exports = router;
