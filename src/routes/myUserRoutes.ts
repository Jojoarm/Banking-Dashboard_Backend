import express from 'express';
import {
  validateUserLoginRequest,
  validateUserSignUpRequest,
} from '../middlewares/validation';
import MyUserController from '../controllers/MyUserController';
import verifyToken from '../middlewares/auth';

const router = express.Router();

router.post(
  '/register',
  validateUserSignUpRequest,
  MyUserController.createUser
);

router.post('/login', validateUserLoginRequest, MyUserController.loginUser);
router.get('/validate-token', verifyToken, MyUserController.validateToken);
router.get('/', verifyToken, MyUserController.getCurrentUser);
router.delete('/logout', MyUserController.userLogout);

export default router;
