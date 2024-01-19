import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { REGISTER_FORM } from '../data';
import { RegisterSchema } from '../validation';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import InputErrorMessage from '../components/InputErrorMessage';
import axiosInstance from '../config/axios.config';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { IAxiosErrorMessage } from '../interfaces';
import { Link, useNavigate } from 'react-router-dom';

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(RegisterSchema),
  });

  // Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    try {
      const { status } = await axiosInstance.post('/auth/local/register', data);

      if (status == 200) {
        toast.success(
          'Awesome! You Will Navigate To Login Page After 2 Seconds',
          {
            position: 'bottom-center',
            duration: 1500,
            style: {
              border: '1px solid #4338CA',
              padding: '16px',
              color: '#ffffff',
              backgroundColor: '#4338CA',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#4338CA',
            },
          }
        );
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IAxiosErrorMessage>;
      toast.error(`${errorObj?.response?.data?.error?.message}`, {
        position: 'bottom-center',
        duration: 1500,
        style: {
          border: '1px solid #000000',
          padding: '16px',
          color: '#ffffff',
          backgroundColor: '#ff0000',
        },
        iconTheme: {
          primary: '#ffffff',
          secondary: '#ff0000',
        },
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Button fullWidth isLoading={loading}>
          {loading ? 'Registering' : 'Register'}
        </Button>
        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>Already Have An Account?</span>
          <Link
            to={'/login'}
            className="text-indigo-600 underline font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
