import Crud from '../utils/crud';
import { UserType } from '../types/interfaces/User';
import { PasswordResetInterface } from '../types/interfaces/PasswordReset';
import UserModel from '../models/UserModel';
import { isValidPassword } from '../utils/passwordValidationUtil';
// import { sendDocusign } from '../utils/docusignUtil';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { loginUser } from './AuthController';

const defaultController = Crud(UserModel);

const createAccount = async (req: Request, res: Response) => {
  const {
    email, password, userType, username,
  } = req.body;

  if (!username) req.body.username = req.body.email;

  if (!email && !password && !userType) {
    res.status(400).json({ message: 'Missing Fields' });
    return;
  }

  if (!isValidPassword(password)) {
    res.status(400).json({ message: 'Password does not meet requirements' });
    return;
  }

  const query = await UserModel.find({ $or: [{ email }, { username: req.body.username }] }).lean().exec();
  const user = query[0];

  if (user) {
    res.status(400).json({ message: 'User already exists!' });
    return;
  }

  if (req.body.permissionLevel === UserType.ADMINISTRATOR) {
    res.status(400).json({ message: 'Not allowed to create Admin users' });
  }

  const getCreatedUser = await defaultController.createWithModelReturn(req, res);
  req.user = {
    ...getCreatedUser,
    password: undefined,
  };

  loginUser(req, res);
};

const updateAccount = async (req: Request, res: Response) => {
  const { password } = req.body;

  if (req.body.password === undefined) {
    defaultController.updateOne(req, res);
  } else {
    // Encrypt password
    bcrypt.hash(password, 8, (err, hash) => {
      if (err) {
        defaultController.handleError(res, err);
      }
      req.body.password = hash;
      defaultController.updateOne(req, res);
    });
  }
};

const updatePassword = async (req: Request, res: Response, token: PasswordResetInterface) => {
  try {
    const { password } = req.body;

    bcrypt.hash(password, 8, (err, hash) => {
      if (err) {
        defaultController.handleError(res, err);
      }

      UserModel.findOneAndUpdate(
        { email: token.email },
        { $set: { password: hash } },
        { new: true },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ).lean().exec().then(() => {
        res.status(200).send({ message: 'Password Reset' });
      });
    });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const findUser = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserModel.findOne({ _id: req.params.id }, {
    password: 0,
    awaitingDocusign: 0,
    userType: 0,
  }).lean().exec((err, data) => {
    if (err) {
      res.status(500).json(data);
    } else res.json(data);
  });
};

export default {
  create: createAccount,
  findAll: defaultController.findAll,
  updateOne: updateAccount,
  findOne: findUser,
  createAdminProfile: defaultController.create,
  updatePassword,
};
