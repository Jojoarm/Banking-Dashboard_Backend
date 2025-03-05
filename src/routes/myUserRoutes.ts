import express from 'express';
import {
  validateUserLoginRequest,
  validateUserSignUpRequest,
} from '../middlewares/validation';
import MyUserController from '../controllers/MyUserController';
import verifyToken from '../middlewares/auth';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.post(
  '/register',
  upload.single('imageFile'),
  validateUserSignUpRequest,
  MyUserController.createUser
);

router.post('/login', validateUserLoginRequest, MyUserController.loginUser);
router.get('/validate-token', verifyToken, MyUserController.validateToken);
router.get('/', verifyToken, MyUserController.getCurrentUser);
router.delete('/logout', MyUserController.userLogout);

export default router;
