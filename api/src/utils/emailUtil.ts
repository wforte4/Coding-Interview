import { User } from '../types/interfaces/User';
import { Notification } from '../types/interfaces/Notification';
import NotificationModel from '../models/NotificationModel';
import UserModel from '../models/UserModel';
import { EmailType } from '../types/constants/Email';
import mailChimp from '@mailchimp/mailchimp_transactional';

const mailchimpClient = mailChimp(
  process.env.MAILCHIMP_API_KEY || '',
);

interface EmailList {
  email: string;
}

const findNonNotifiedUsers = (users: User[], notifications: Notification[]) => users.filter((user: User) => {
  const hasUserBeenNotified = !notifications.some((notification: Notification) => String(user._id) === String(notification.userId));
  return hasUserBeenNotified;
});

export const cleanAndNotifyUsers = async (userIds: string[], users: User[], elementId: string) => {
  const notifications = await NotificationModel.find({ userId: { $in: userIds }, elementId }).exec();
  const notNotified = findNonNotifiedUsers(users, notifications);

  notNotified.forEach((user: User) => {
    NotificationModel.create({ userId: user._id, elementId });
  });

  return notNotified.map((user: User) => ({ email: user.email }));
};

interface SendEmailProps{
  emailType: EmailType;
  userIds: string[];
  contentId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

// export const sendLessonAssignmentEmail = async (userList: EmailList[], lessonName: string) => {
//   await mailchimpClient.messages.sendTemplate({
//     template_name: 'lesson-assignment',
//     template_content: [{}],
//     message: {
//       subject: 'New Lesson Assigned',
//       from_email: 'info@creativesurvivalri.org',
//       from_name: 'Creative Survival RI',
//       to: userList,
//       merge: true,
//       global_merge_vars: [
//         {
//           name: 'LESSON_NAME',
//           content: lessonName,
//         },
//       ],
//     },
//   });
// };

// export const sendStudentCompletedEmail = async (
//   teacherEmail: EmailList[],
//   studentName: string,
//   lessonName: string,
//   emailPhoto: string,
// ) => {
//   try {
//     await mailchimpClient.messages.sendTemplate({
//       template_name: 'lesson-completed',
//       template_content: [{}],
//       message: {
//         subject: 'Lesson Completed',
//         from_email: 'info@creativesurvivalri.org',
//         from_name: 'Creative Survival RI',
//         to: teacherEmail,
//         merge: true,
//         global_merge_vars: [
//           {
//             name: 'LESSON_PICTURE',
//             content: emailPhoto,
//           },
//           {
//             name: 'STUDENT_NAME',
//             content: studentName,
//           },
//           {
//             name: 'LESSON_NAME',
//             content: lessonName,
//           },
//         ],
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const sendPasswordResetEmail = async (userList: EmailList[], token: string) => {
  await mailchimpClient.messages.sendTemplate({
    template_name: 'passord-reset',
    template_content: [{
      name: 'Password Reset',
      content: 'content',
    }],
    message: {
      subject: 'Reset Password Link',
      from_email: 'info@creativesurvivalri.org',
      from_name: 'Creative Survival RI',
      to: userList,
      merge: true,
      global_merge_vars: [
        {
          name: 'RESET_TOKEN',
          content: token,
        },
      ],
    },
  });
};

export const sendEmail = async (props: SendEmailProps) => {
  const {
    userIds,
    contentId,
    content,
    emailType,
  } = props;

  // Find all users that need to be notified, create a notification entry for them, and send them an email
  const users = await UserModel.find({ _id: { $in: userIds } }).lean().exec();
  const cleanUserList = await cleanAndNotifyUsers(userIds, users, contentId);
  switch (emailType) {
  case EmailType.PASSWORD_RESET:
    await sendPasswordResetEmail(cleanUserList, content.token);
    break;
  default:
    break;
  }
};
