export default function SignUp() {
  return (
    <div className="pt-20 flex justify-center text-text-primary">
      <div className="p-8 border border-gray-300 shadow rounded-md flex items-center flex-col">
        <div className="size-10">
          <img src="/TaskManager.png" alt="logo" className="size-full" />
        </div>
        <p className="text-4xl text-theme-hover">Create An Account</p>
        <p>Get started with TaskDuty and organise your tasks.</p>

        <form className="space-y-4 flex flex-col w-full mt-6">
          <div className="flex flex-col">
            <label htmlFor="fullname">FullName</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="border rounded-md p-2"
            ></input>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              name="email"
              className="border rounded-md p-2"
            ></input>
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">password</label>
            <input
              type="text"
              id="password"
              name="password"
              className="border rounded-md p-2"
            ></input>
          </div>
          <button className="rounded-md bg-theme hover:bg-theme-hover text-lg text-white py-3">
            Sign Up
          </button>
          <p>
            Already have an account?{' '}
            <span className="text-theme cursor-pointer underline hover:text-theme-hover">
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
