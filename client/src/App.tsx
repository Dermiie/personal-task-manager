import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import CoverPage from './pages/CoverPage';
import MyTaskPage from './pages/MyTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import NewTaskPage from './pages/NewTaskPage';

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<CoverPage />}></Route>
          <Route path="my-tasks" element={<MyTaskPage />}></Route>
          <Route path="new-task" element={<NewTaskPage />}></Route>
          <Route path="edit-task/:id" element={<EditTaskPage />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
