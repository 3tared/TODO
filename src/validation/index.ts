import * as yup from 'yup';

export const RegisterSchema = yup
  .object({
    username: yup
      .string()
      .required('Username Is Required')
      .min(5, 'Username Sould Be At-Least 5 Characters'),

    email: yup
      .string()
      .required('Email Is Required')
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        'Email Is Not Valid'
      ),

    password: yup
      .string()
      .required('Password Is Required')
      .min(6, 'Password Sould Be At-Least 6 Characters'),
  })
  .required();

export const LoginSchema = yup
  .object({
    identifier: yup
      .string()
      .required('Email Is Required')
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        'Email Is Not Valid'
      ),

    password: yup
      .string()
      .required('Password Is Required')
      .min(6, 'Password Sould Be At-Least 6 Characters'),
  })
  .required();

interface ISchema {
  title: string;
  description: string;
}

export const TodoSchema = ({ title, description }: ISchema) => {
  const errors = {
    title: '',
    description: '',
  };

  if (!title.trim() || title.length < 5 || title.length > 30) {
    errors.title = 'Todo Title Must Be Between 5 & 30 Characters!';
  }
  if (
    !description.trim() ||
    description.length < 20 ||
    description.length > 500
  ) {
    errors.description =
      'Todo Description Must Be Between 30 & 500 Characters!';
  }

  return errors;
};
