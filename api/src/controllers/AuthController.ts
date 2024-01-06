import UserModel from '../models/UserModel';
import config from '../utils/config';
import { UserType } from '../types/interfaces/User';
import crud from '../utils/crud';
import PasswordResetTokenModel from '../models/PasswordResetTokenModel';
import { sendEmail } from '../utils/emailUtil';
import { EmailType } from '../types/constants/Email';
import jwt from 'jsonwebtoken';
import { VerifyFunction } from 'passport-local';
import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import UsersController from './UsersController';

const passwordTokenController = crud(PasswordResetTokenModel);

export const authenticateUser: VerifyFunction = (username, password, done) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserModel.find({ $or: [{ email: username }, { username }] }, (err, query: any) => {
    if (err) {
      return done(err);
    }
    const user = query[0];
    if (!user) {
      return done(null, false, { message: 'Invalid Credentials' });
    }
    user.checkPassword(password).then((passwordsMatch: boolean) => {
      if (!passwordsMatch) {
        return done(null, false, { message: 'Invalid Credentials' });
      }
    });

    const userObject = user.toObject();
    userObject.password = undefined;
    return done(null, userObject);
  });
};

export const logoutUser = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('error logging user out: ', err);
    }
  });
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json('Logged Out');
};

export const loginUser = (req: Request, res: Response) => {
  try {
    const token = jwt.sign({ ...req.user, type: 'access' }, process.env.JWT_SECRET || '');
    const refreshToken = jwt.sign({ ...req.user, type: 'refresh' }, process.env.JWT_SECRET || '');

    res.cookie('access_token', token, { maxAge: config.accessTokenExpiration, httpOnly: true });
    res.cookie('refresh_token', refreshToken, { maxAge: config.refreshTokenExpiration, httpOnly: true });
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

export const validateAuthToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization || req.cookies.access_token) {
    try {
      let authorization = [];

      // Get access token from header or cookies
      if (req.cookies.access_token) {
        authorization[1] = req.cookies.access_token;
      } else {
        authorization = req.headers?.authorization?.split(' ') || [''];
        if (authorization[0] !== 'Bearer') res.status(401).send();
      }

      // Verify if the token is valid / expired / a refresh token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jwt.verify(authorization[1], process.env.JWT_SECRET || '', (err: any, decoded: any) => {
        if (err) {
          return res.status(401).send({ error: err.name });
        }
        if (decoded.type === 'refresh') return res.status(401).send({ error: 'Only Access Tokens Are Valid' });
        req.user = decoded;
        return next();
      });
    } catch (err) {
      return res.status(403).send();
    }
  } else {
    return res.status(401).send();
  }
};

function generatePasswordResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

export const forgotPassword = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserModel.findOne({ email: req.body.email }, (err: any, user: any) => {
    if (user) {
      req.body.tokenId = generatePasswordResetToken();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      passwordTokenController.createWithModelReturn(req, res).then((token: any) => {
        sendEmail({
          emailType: EmailType.PASSWORD_RESET,
          userIds: [user._id],
          contentId: token.tokenId,
          content: {
            token: req.body.tokenId,
          },
        });
      });
    }
  });

  res.status(200).json({ message: 'Password reset email sent' });
};

export const resetPassword = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PasswordResetTokenModel.findOne({ tokenId: req.body.token }, (err: any, token: any) => {
    if (!token || err) {
      return res.status(400).send({ error: 'Invalid Token' });
    }

    UsersController.updatePassword(req, res, token).then(async () => {
      token.remove();
    });
    return res.status(200).send({ message: 'If there was an account to update then it was updated' });
  });
};

export const refreshToken = (req: Request, res: Response) => {
  if (!req.cookies.refresh_token) {
    return res.status(401).send();
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(req.cookies.refresh_token, process.env.JWT_SECRET || '', (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ error: err.name });
      }
      req.user = decoded;
      loginUser(req, res);
    });
  } catch (error) {
    return res.status(500).send();
  }
};

export const minimumPermissionLevelRequired = (minimumPermissionLevel: UserType) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.userType >= minimumPermissionLevel) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};

export const mustBeSameUserOrAdmin = (minimumPermissionLevel: UserType) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.userType >= minimumPermissionLevel || req.user._id === req.body._id)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};
