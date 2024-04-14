import logo from "../assets/social-lilac.svg";
import Timer from "./Timer";
import CurrentUserType from "../types/CurrentUserType";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const NavBar = ({
  extras,
  user,
}: {
  extras: JSX.Element | null;
  user: boolean;
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
        "/user/me?jwt=" +
        localStorage.getItem("auth-token"),
      )
      .then((res) => {
        if (res.data.error) return;
        setCurrentUser(res.data.you);
      });
  }, []);
  const navigator = useNavigate();

  return (
    <div className="navbar bg-base-100 justify-between">
      <div className="">
        <a className="btn btn-ghost text-xl">
          <img src={logo} width="75" className="hidden lg:block" />
          {extras ? extras : null}
        </a>
      </div>
      <Timer />
      {user == true && (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>
                  <div className="profile cursor-pointer z-20 flex gap-5 items-center">
                    {!currentUser ? (
                      <div className="avatar skeleton">
                        <div className="w-12 rounded-full"></div>
                      </div>
                    ) : currentUser?.profile_image == "NO IMAGE" ? (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                          <span className="text-lg">
                            {currentUser?.name.split(" ")[0][0].toUpperCase()}
                            {currentUser?.name.split(" ")[1][0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img
                            src={currentUser?.profile_image}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                    <div className="lg:flex hidden flex-col ">
                      {!currentUser ? (
                        <>
                          <div className="w-52 rounded-full h-3 skeleton"></div>
                          <div className="w-24 rounded-full h-3 skeleton"></div>
                        </>
                      ) : (
                        <>
                          <h1 className="text-lg lg:text-xl">
                            {currentUser.name}
                          </h1>
                          <p className="text-xs lg:text-sm">
                            {currentUser.email}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </summary>
                <ul className="p-2 bg-base-100 rounded-t-none z-30">
                  <li>
                    <Link to="/setting">Setting</Link>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        navigator("/user/profile/self");
                      }}
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        localStorage.clear();
                        navigator("/");
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBar;
