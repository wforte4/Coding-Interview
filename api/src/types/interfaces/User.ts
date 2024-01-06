
export enum UserType {
  DEFAULT = 100,
  ADMINISTRATOR = 400
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  userType: UserType;
}
