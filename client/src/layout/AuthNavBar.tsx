import { NavLink, useLocation } from 'react-router-dom';
import Button from '../component/Button';

export default function AuthNavBar() {
  const location = useLocation();
  return (
    <div className="container w-11/12 md:w-9/12  mx-auto py-2 flex justify-between font-signika text-dark items-center ">
      <div className="flex gap-1 items-center cursor-pointer">
        <div className="size-10">
          <img src="/TaskManager.png" alt="logo" className="size-full" />
        </div>
        <p className="text-2xl hidden md:block">Task Duty</p>
      </div>
      <div className="flex items-center gap-4 md:gap-12 text-lg">
        {location.pathname !== '/login' && (
          <NavLink to={'/login'} className="cursor-pointer">
            <Button>Login</Button>
          </NavLink>
        )}
        {location.pathname !== '/signup' && (
          <NavLink to={'/signup'} className="cursor-pointer">
            <Button>Sign Up</Button>
          </NavLink>
        )}
      </div>
    </div>
  );
}
