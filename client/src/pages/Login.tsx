import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useLogin } from '../hooks/useAuth';
import { themedToast } from '../utils/ToastFeedback';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(2, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmitForm = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        reset();
        themedToast.success('Login Successful');
        navigate('/'); // Replace with your protected dashboard route
      },
      onError: (err) => {
        themedToast.error(`${err.message}. Try again!`);
      },
    });
  };

  return (
    <div className="pt-20 flex justify-center text-text-primary">
      <div className="p-8 border border-gray-300 shadow rounded-md flex items-center flex-col">
        <div className="size-10">
          <img src="/TaskManager.png" alt="logo" className="size-full" />
        </div>
        <p className="text-4xl text-theme-hover">Welcome Back</p>
        <p>Log in to continue managing your tasks.</p>

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          noValidate
          className="space-y-4 flex flex-col w-full mt-6"
        >
          <div className="flex flex-col">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              {...register('email')}
              className="border rounded-md p-2"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              className="border rounded-md p-2"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-theme hover:bg-theme-hover text-lg text-white py-3 disabled:opacity-60"
          >
            {isSubmitting || isPending ? 'Logging in...' : 'Login'}
          </button>

          <p>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-theme underline hover:text-theme-hover"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
