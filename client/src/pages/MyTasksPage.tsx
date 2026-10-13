import { useNavigate } from 'react-router-dom';
import TaskCard from '../component/TaskCard';
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useTasks } from '../hooks/useTasks';

type Tab = 'all' | 'Important' | 'Urgent';

export default function MyTasksPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'Important' | 'Urgent'>('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 300);

  const { data, isLoading, error } = useTasks({
    page,
    search: debouncedSearch,
    tab,
  });

  const tasks = data?.tasks || [];
  const totalPages = data?.pagination.totalPages ?? 1;
  const totalTasks = data?.pagination.totalTasks ?? 0;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1); // a new search always starts from the first page
  }

  function handleTabChange(next: Exclude<Tab, 'all'>) {
    setTab((current) => (current === next ? 'all' : next));
    setPage(1);
  }

  const tabButtonClass = (active: boolean) =>
    `px-3 py-1 rounded-lg border cursor-pointer ${
      active ? 'bg-gray-200 border-grey-200' : 'border-gray-500'
    }`;

  return (
    <div className="flex flex-col md:gap-4 my-5">
      <header className="flex justify-between gap-20 py-5 items-center">
        <h1 className="text-2xl">My Tasks</h1>
        <input
          type="text"
          placeholder="Search Task"
          className="rounded-md border border-gray-300 px-4 py-2 grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <button
          className="text-theme cursor-pointer"
          onClick={() => navigate('/new-task')}
        >
          + Add New Task
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            className={tabButtonClass(tab === 'Important')}
            aria-pressed={tab === 'Important'}
            onClick={() => handleTabChange('Important')}
          >
            View only Important Tasks
          </button>
          <button
            type="button"
            className={tabButtonClass(tab === 'Urgent')}
            aria-pressed={tab === 'Urgent'}
            onClick={() => handleTabChange('Urgent')}
          >
            View only Urgent Tasks
          </button>
        </div>
      </header>
      {isLoading && <p className="w-full text-center">Loading...</p>}
      {error && <p role="alert">{error.message}</p>}
      {!isLoading && !error && tasks?.length === 0 && (
        <p>
          {debouncedSearch
            ? `No tasks match "${debouncedSearch}".`
            : 'No tasks yet.'}
        </p>
      )}
      <div className="space-y-6">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <p>
            Page {page} of {totalPages}
          </p>
          <p>Total Tasks: {totalTasks}</p>
        </div>

        <div className="gap-4 flex items-center">
          <button
            className="border border-gray-500 px-4 py-1 rounded-lg cursor-pointer"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button
            className="border border-gray-500 px-4 py-1 rounded-lg cursor-pointer"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
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
