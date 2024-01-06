import PasswordValidator from 'password-validator';

export const isValidPassword = (password: string) => {
  const schema = new PasswordValidator();

  schema
    .is().min(8)
    .is().max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols();

  return schema.validate(password);
};
