import { User, UserType } from '../types/interfaces/User';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserSchemaType = {
  password: string;
  checkPassword: (password: string) => Promise<boolean>;
} & User

const UserSchema = new Schema<UserSchemaType>({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    default: '',
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  userType: {
    type: Number,
    default: UserType.DEFAULT,
  },
});

UserSchema.virtual('id').get(function returnId(this: { _id: string; }) {
  return this._id.toString();
});

UserSchema.virtual('displayName').get(function displayName(this: { firstName: string; lastName: string; }) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.set('toJSON', {
  virtuals: true,
});

// eslint-disable-next-line func-names
UserSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    }
    return next();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return next(err);
  }
});

UserSchema.methods.checkPassword = function checkPassword(password: string) {
  const passwordHash = this.password;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      return resolve(same);
    });
  });
};

export default mongoose.model<User>('User', UserSchema);
