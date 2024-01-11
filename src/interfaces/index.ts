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
