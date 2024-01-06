import { User, UserType } from '../types/interfaces/User';
import UserModel from '../models/UserModel';

export const createAdminUser = async () => {
  const adminUser: Array<User> = await UserModel.find({ email: 'admin@admin.org' }).lean().exec();
  if (!(adminUser.length > 0)) {
    UserModel.create({
      email: 'admin@admin.org',
      firstName: 'Admin',
      lastName: 'Admin',
      password: process.env.ADMIN_PASS || '',
      permissionLevel: UserType.ADMINISTRATOR,
      invitecode: '',
    });
  }
};
