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
