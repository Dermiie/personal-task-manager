import { SquarePen, Trash } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: number;
  priority: string;
  title: string;
  description: string;
}

interface TaskProps {
  task: Task;
}

export default function TaskCard({ task }: TaskProps) {
  const navigate = useNavigate();
  return (
    <section className="flex-col gap-3 w-full px-2 py-3 border rounded-lg border-gray-200">
      <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <p
          className={
            task.priority === 'Important' ? 'text-destructive' : 'text-green'
          }
        >
          {task.priority}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              navigate(`/edit-task/${task.id}`);
            }}
          >
            <SquarePen className="size-5 font-light" />
            Edit
          </Button>
          <Button variant="outline">
            <Trash className="size-5" /> Delete
          </Button>
        </div>
      </div>
      <main className="space-y-3 py-3">
        <h2 className="text-2xl">{task.title}</h2>
        <p className="text-text-primary text-lg ">{task.description}</p>
      </main>
    </section>
  );
}
