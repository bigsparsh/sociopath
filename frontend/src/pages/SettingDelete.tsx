import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const SettingDelete = ({
  page,
}: {
  page: Dispatch<SetStateAction<string>>;
}) => {
  const [error, setError] = useState<string | null>(null);
  const password = useRef<HTMLInputElement>(null);
  useEffect(() => {
    page("Delete Account");
  }, []);
  return (
    <div className="h-full my-3 lg:my-10 flex lg:flex-row gap-y-10 gap-x-3 flex-col justify-evenly items-center w-full px-10">
      {error ? (
        <div className="toast">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      ) : null}
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-300/70">
        <form className="card-body" encType="multipart/form-data">
          <h1 className="text-2xl font-semibold text-center">
            Delete Account Form
            <span className="text-sm block font-normal mb-3">
              Enter your password to delete your account
            </span>
          </h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              ref={password}
              className="input input-bordered bg-base-100/50 backdrop-blur-sm placeholder:text-xs"
              required
            />
          </div>
          <button className="btn hover:btn-outline-none btn-outline mt-4 w-fit mx-auto btn-error">
            I consent for my account to be deleted
          </button>
        </form>
      </div>
    </div>
  );
};
export default SettingDelete;
