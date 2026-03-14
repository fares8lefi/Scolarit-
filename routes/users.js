import express from 'express';
import * as userController from '../Controllers/userController.js';

const router = express.Router();

/* GET users listing. */
router.post('/invite', userController.inviteUser);

export default router;



