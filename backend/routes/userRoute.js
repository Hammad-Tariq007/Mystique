import express from 'express'
import { loginUser, registerUser, adminLogin, listUsers } from '../controllers/userController.js'
import adminAuth from '../middleware/adminAuth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/list', adminAuth, listUsers);

export default userRouter;