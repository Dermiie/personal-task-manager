import { useNavigate } from 'react-router-dom';

export default function CoverPage() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-16 items-center ">
      <div className="w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl">
          Manage your Tasks on
          <br /> <span className="text-theme">TaskDuty</span>
        </h1>
        <p className="text-xl text-text-primary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non tellus,
          sapien, morbi ante nunc euismod ac felis ac. Massa et, at platea
          tempus duis non eget. Hendrerit tortor fermentum bibendum mi nisl
          semper porttitor. Nec accumsan.
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
      <div className="w-1/2 p-8">
        <img
          src="/CoverImage.png"
          alt="cover-image"
          className="size-full mt-8"
        />
      </div>
    </div>
  );
}
