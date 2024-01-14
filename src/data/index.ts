import { IFormInputs, IFormLoginInputs } from '../interfaces';

export const REGISTER_FORM: IFormInputs[] = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Type Your Username',
    validation: {
      required: true,
      minLength: 5,
    },
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Type Your Email',
    validation: {
      required: true,
      pattern:
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Type Your Password',
    validation: {
      required: true,
      minLength: 6,
    },
  },
];

export const LOGIN_FORM: IFormLoginInputs[] = [
  {
    name: 'identifier',
    type: 'email',
    placeholder: 'Type Your Email',
    validation: {
      required: true,
      pattern:
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Type Your Password',
    validation: {
      required: true,
      minLength: 6,
    },
  },
];
