import { ChevronLeft } from 'lucide-react';
import TaskForm from '../component/TaskForm';
import { useNavigate } from 'react-router-dom';

export default function NewTaskPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:gap-4 my-5">
      <header className="flex justify-between py-5">
        <h1
          className="text-2xl flex gap-2 items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
          New Task
        </h1>
      </header>

      <TaskForm />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mt-2 cursor-pointer text-center text-lg text-theme underline"
      >
        {' '}
        Back to Top{' '}
      </button>
    </div>
  );
}
