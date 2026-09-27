import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function MainLayout() {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <div className="border-b border-gray-300">
        <NavBar />
      </div>
      <main className="container w-9/12 mx-auto font-signika">
        <Outlet />
      </main>
      <footer />
    </div>
  );
}
