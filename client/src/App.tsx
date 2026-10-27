import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import CoverPage from './pages/CoverPage';
import MyTasksPage from './pages/MyTasksPage';
import EditTaskPage from './pages/EditTaskPage';
import NewTaskPage from './pages/NewTaskPage';
import ProtectedRoutes from './component/ProtectedRoutes';
import Login from './pages/Login';
import AuthLayout from './layout/AuthLayout';
import SignUp from './pages/SignUp';

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout></AuthLayout>}>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Route>
        <Route
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="/" element={<CoverPage />}></Route>
          <Route path="my-tasks" element={<MyTasksPage />}></Route>
          <Route path="new-task" element={<NewTaskPage />}></Route>
          <Route path="edit-task/:id" element={<EditTaskPage />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
