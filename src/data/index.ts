import { IFormInputs } from '../interfaces';

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
    type: 'text',
    placeholder: 'Type Your Password',
    validation: {
      required: true,
      minLength: 6,
    },
  },
];
