import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { REGISTER_FORM } from '../data';
import { RegisterSchema } from '../validation';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import InputErrorMessage from '../components/InputErrorMessage';

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(RegisterSchema),
  });

  // Handlers
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  // Renders
  const renderFormInputs = REGISTER_FORM.map(
    ({ name, placeholder, type, validation }, inx) => (
      <div key={inx}>
        <Input
          type={type}
          {...register(name, validation)}
          placeholder={placeholder}
        />
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderFormInputs}
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
