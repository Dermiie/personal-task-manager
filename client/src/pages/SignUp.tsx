import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useSignUp } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { themedToast } from '../utils/ToastFeedback';

const registerSchema = z.object({
  fullname: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export default function SignUp() {
  const { mutate: signup, isPending } = useSignUp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
    },
  });

  const onHandleSubmit = (data: RegisterFormData) => {
    signup(data, {
      onSuccess: () => {
        reset();
        themedToast.success('Sign-up Successfull');
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
        <p className="text-4xl text-theme-hover">Create An Account</p>
        <p>Get started with TaskDuty and organise your tasks.</p>

        <form
          className="space-y-4 flex flex-col w-full mt-6"
          onSubmit={handleSubmit(onHandleSubmit)}
        >
          <div className="flex flex-col">
            <label htmlFor="fullname">FullName</label>
            <input
              type="text"
              id="fullname"
              {...register('fullname')}
              className="border rounded-md p-2"
            ></input>
            {errors.fullname && (
              <span className="text-red-500 text-sm">
                {errors.fullname.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              {...register('email')}
              className="border rounded-md p-2"
            ></input>
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">password</label>
            <input
              type="text"
              id="password"
              {...register('password')}
              className="border rounded-md p-2"
            ></input>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            disabled={isSubmitting || isPending}
            className="rounded-md bg-theme hover:bg-theme-hover text-lg text-white py-3"
          >
            Sign Up
          </button>
          <p>
            Already have an account?{' '}
            <span className="text-theme cursor-pointer underline hover:text-theme-hover">
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
