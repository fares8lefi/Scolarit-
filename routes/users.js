var express = require('express');
var router = express.Router();
const userController= require('../Controllers/userController');
/* GET users listing. */
router.post('/invite', userController.inviteUser);
module.exports = router;
