import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function MainLayout() {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <div className="border-b border-gray-300 fixed z-10 bg-white w-full">
        <NavBar />
      </div>
      <main className="container w-11/12 md:w-9/12 mx-auto font-signika mt-12">
        <Outlet />
      </main>
      <footer />
    </div>
  );
}
