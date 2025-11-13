import {Router} from 'express'
import { upload } from '../middleware/multer.middleware'
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJwt } from '../middleware/auth.middleware.js';

const router = Router(); 

router.route("/register").post(upload.single("profilePhoto"), registerUser); 

router.route('/login').post(loginUser)

router.route("/logout").post(verifyJwt, logoutUser)


