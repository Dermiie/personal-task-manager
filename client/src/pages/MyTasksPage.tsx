import { useNavigate } from 'react-router-dom';
import TaskCard from '../component/TaskCard';

const tasks = [
  {
    id: 1,
    priority: 'Urgent',
    title: 'FinTech Website Update',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
  },
  {
    id: 2,
    priority: 'Important',
    title: 'Agro Website Update',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
  },
  {
    id: 3,
    priority: 'Urgent',
    title: 'FinTech Website Update',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
  },
  {
    id: 4,
    priority: 'Important',
    title: 'Agro Website Update',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
  },
];

export default function MyTasksPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 my-5">
      <header className="flex justify-between py-5">
        <h1 className="text-2xl">My Tasks</h1>

        <button
          className="text-theme cursor-pointer"
          onClick={() => navigate('/new-task')}
        >
          + Add New Task
        </button>
      </header>
      <div className="space-y-6">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
      <footer className="text-theme underline text-center text-lg mt-5">
        Back to Top
      </footer>
    </div>
  );
}
