import { PasswordResetInterface } from '../types/interfaces/PasswordReset';
import mongoose, { Schema } from 'mongoose';

const PasswordResetTokenSchema = new Schema<PasswordResetInterface>({
  tokenId: String,
  email: String,
});

export default mongoose.model<PasswordResetInterface>('PasswordResetToken', PasswordResetTokenSchema);
