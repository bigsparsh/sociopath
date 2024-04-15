import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import CurrentUserType from "../types/CurrentUserType";
import { logout } from "../utils";
import { useNavigate } from "react-router-dom";

const SettingDelete = ({
  page,
}: {
  page: Dispatch<SetStateAction<string>>;
}) => {
  const [error, setError] = useState<string | null>(null);
  const password = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const navigator = useNavigate();
  useEffect(() => {
    page("Delete Account");
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
        "/user/me?jwt=" +
        localStorage.getItem("auth-token"),
      )
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        }
        setCurrentUser(res.data.you);
      });
  }, []);
  const deleteAccount = () => {
    if (currentUser?.password !== password.current?.value) {
      setError("Password does not match");
      return;
    }
    axios
      .delete(
        import.meta.env.VITE_BACKEND_URL +
        "/user/delete?filterId=" +
        currentUser?.user_id,
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
      .then((res) => {
        res.data.error && setError(res.data.error);
        logout(navigator);
      });
  };
  return (
    <div className="h-full my-3 lg:my-10 flex lg:flex-row gap-y-10 gap-x-3 flex-col justify-evenly items-center w-full px-10">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-error ">
            Account Deletion Consent
          </h3>
          <p className="py-4">
            After your account is delete, there will be no way of recovering any
            kind of data and you will not be able to login again.
          </p>
          <div className="modal-action">
            <a href="#" className="btn">
              Close
            </a>
            <button className="btn btn-error" onClick={deleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
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
          <a
            href="#my_modal_8"
            className="btn  hover:btn-outline-none btn-outline mt-4 w-fit mx-auto btn-error"
          >
            I consent for my account to be deleted
          </a>
        </form>
      </div>
    </div>
  );
};
export default SettingDelete;
