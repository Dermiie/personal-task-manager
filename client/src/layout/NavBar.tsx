import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="container w-9/12 mx-auto py-3 flex justify-between font-signika text-dark items-center ">
      <div
        className="flex gap-1 items-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="size-10">
          <img src="/TaskManager.png" alt="logo" className="size-full" />
        </div>
        <p className="text-2xl ">Task Duty</p>
      </div>
      <div className="flex items-center gap-12 text-lg">
        {location.pathname !== '/new-task' && (
          <NavLink to={'/new-task'} className="cursor-pointer">
            New Task
          </NavLink>
        )}
        {location.pathname !== '/my-tasks' && (
          <NavLink to={'/my-tasks'} className="cursor-pointer">
            All Task
          </NavLink>
        )}
        <div className="size-12 relative">
          <div className="size-3 bg-theme absolute top-0 right-1 rounded-full"></div>
          <img src="/MockAvatar.png" alt="logo" className="size-full" />
        </div>
      </div>
    </div>
  );
}
