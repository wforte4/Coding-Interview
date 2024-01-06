import { UserType } from '../../types/interfaces/User';
import UsersController from '../../controllers/UsersController';
import { validateAuthToken, mustBeSameUserOrAdmin, minimumPermissionLevelRequired } from '../../controllers/AuthController';
import { Router } from 'express';

export const usersRouter = Router();

usersRouter.route('/createAdmin')
  .post(
    validateAuthToken,
    minimumPermissionLevelRequired(UserType.ADMINISTRATOR),
    UsersController.createAdminProfile,
  );

usersRouter.route('/')
  .get(UsersController.findAll)
  .post(UsersController.create);

usersRouter.route('/:id')
  .get(UsersController.findOne)
  .put(validateAuthToken, mustBeSameUserOrAdmin(UserType.ADMINISTRATOR), UsersController.updateOne);
