import { Notification } from '../types/interfaces/Notification';
import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema<Notification>({
  userId: {
    type: String,
    require,
  },
  elementId: {
    type: String,
    require,
  },
});

NotificationSchema.virtual('id').get(function returnId(this: Notification) {
  return this._id.toString();
});

NotificationSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model<Notification>('Notification', NotificationSchema);
