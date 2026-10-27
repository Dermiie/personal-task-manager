import { useNavigate } from 'react-router-dom';

export default function CoverPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-16 items-center md:my-5">
      <div className="md:w-1/2 flex flex-col gap-6">
        <h1 className="text-2xl md:text-4xl">
          Manage your Tasks on
          <br /> <span className="text-theme">TaskDuty</span>
        </h1>
        <p className="text-md md:text-xl text-text-primary">
          Welcome to TaskDuty - your simple space for organizing tasks, managing
          priorities, and keeping track of what needs to get done. Whether it’s
          an important work assignment, a personal goal, or something urgent,
          TaskDuty helps you stay focused, manage your time, and turn your to-do
          list into completed tasks.
        </p>
        <div>
          <button
            className="bg-theme px-3 py-2 text-white text-lg rounded-lg cursor-pointer"
            onClick={() => navigate('/my-tasks')}
          >
            Go to my Tasks
          </button>
        </div>
      </div>
      <div className="md:w-1/2 md:p-8">
        <img
          src="/CoverImage.png"
          alt="cover-image"
          className="size-full mt-8"
        />
      </div>
    </div>
  );
}
