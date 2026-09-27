import { ChevronLeft } from 'lucide-react';
import TaskForm from '../component/TaskForm';
import { useNavigate } from 'react-router-dom';

export default function EditTaskPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 my-5">
      <header className="flex justify-between py-5">
        <h1
          className="text-2xl flex gap-2 items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
          Edit Task
        </h1>
      </header>

      <TaskForm />

      <footer className="text-theme underline text-center text-lg mt-3">
        Back to Top
      </footer>
    </div>
  );
}
