export default function NavBar() {
  return (
    <div className="container w-10/12 mx-auto py-3 flex justify-between font-signika text-dark items-center ">
      <div className="flex gap-1 items-center">
        <div className="size-10">
          <img src="/TaskManager.png" alt="logo" className="size-full" />
        </div>
        <p className="text-2xl ">Task Duty</p>
      </div>
      <div className="flex items-center gap-12 text-lg">
        <p>New Task</p>
        <p>All Task</p>
        <div className="size-12">
          <img src="/MockAvatar.png" alt="logo" className="size-full" />
        </div>
      </div>
    </div>
  );
}
