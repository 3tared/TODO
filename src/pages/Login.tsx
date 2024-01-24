import { SubmitHandler, useForm } from 'react-hook-form';
import InputErrorMessage from '../components/InputErrorMessage';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LOGIN_FORM } from '../data';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { IAxiosErrorMessage } from '../interfaces';
import toast from 'react-hot-toast';
import axiosInstance from '../config/axios.config';
import { LoginSchema } from '../validation';
import { Link } from 'react-router-dom';

interface IFormLoginInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormLoginInput>({
    resolver: yupResolver(LoginSchema),
  });

  // Handlers
  const onSubmit: SubmitHandler<IFormLoginInput> = async (data) => {
    setLoading(true);
    try {
      const { status, data: userData } = await axiosInstance.post(
        '/auth/local',
        data
      );

      if (status == 200) {
        toast.success(
          'Awesome! You Will Navigate To Home Page After 2 Seconds',
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

        localStorage.setItem('loggedInUserData', JSON.stringify(userData));

        setTimeout(() => {
          location.replace('/');
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
  const renderFormLoginInputs = LOGIN_FORM.map(
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
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderFormLoginInputs}
        <Button fullWidth isLoading={loading}>
          Login
        </Button>
        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>Don't Have An Account?</span>
          <Link
            to={'/register'}
            className="text-indigo-600 underline font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
