export interface IFormInputs {
  name: 'username' | 'email' | 'password';
  type: string;
  placeholder: string;
  validation: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
  };
}

export interface IFormLoginInputs {
  name: 'identifier' | 'password';
  type: string;
  placeholder: string;
  validation: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
  };
}

export interface IAxiosErrorMessage {
  error: {
    message?: string;
  };
}

export interface IUserInterface {
  username: string;
  id?: number;
  email: string;
  password: string;
  createdAt?: string;
}
