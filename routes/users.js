const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

/* GET users listing. */
router.post('/invite', userController.inviteUser);
router.post('/signup', userController.singup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/getUsers', userController.getUsers);
router.get('/getUserById/:id', userController.getUserById);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;
