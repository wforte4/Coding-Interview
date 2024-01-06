import {
  loginUser, logoutUser, refreshToken, forgotPassword, resetPassword,
} from '../../controllers/AuthController';
import { Router } from 'express';
import passport from 'passport';

export const authRouter = Router();

authRouter.route('/logout').post(logoutUser);
authRouter.route('/refresh').post(refreshToken);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password').post(resetPassword);
authRouter.route('/').post(passport.authenticate('local'), loginUser);
