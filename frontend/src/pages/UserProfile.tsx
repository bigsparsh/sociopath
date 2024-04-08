import axios from "axios";
import { useEffect, useState } from "react";
import { HiDeviceMobile } from "react-icons/hi";
import {
  HiEnvelope,
  HiMiniTrash,
  HiMiniPencilSquare,
  HiMapPin,
  HiMiniEye,
  HiMiniEyeSlash,
  HiMiniHeart,
  HiMiniIdentification,
} from "react-icons/hi2";
import CurrentUserType from "../types/CurrentUserType";
import { useNavigate, useParams } from "react-router-dom";
import FullPostPopup from "../components/FullPostPopup";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<CurrentUserType>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigator = useNavigate();
  const [overlay, setOverlay] = useState<string | null>();
  const { id } = useParams();

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      setLoading(true);
      if (id == "self") {
        axios
          .get(
            import.meta.env.VITE_BACKEND_URL +
            "/user/me?jwt=" +
            localStorage.getItem("auth-token"),
            {
              headers: {
                Authorization: localStorage.getItem("auth-token"),
              },
            },
          )
          .then((res) => {
            if (res.data.error) return;
            setCurrentUser(res.data.you);
            setLoading(false);
          });
      } else {
        axios
          .get(import.meta.env.VITE_BACKEND_URL + "/user/get?filterId=" + id, {
            headers: {
              Authorization: localStorage.getItem("auth-token"),
            },
          })
          .then((res) => {
            if (res.data.error) return;
            setCurrentUser(res.data.user);
            setLoading(false);
          });
        axios
          .get(
            import.meta.env.VITE_BACKEND_URL +
            "/user/me?jwt=" +
            localStorage.getItem("auth-token"),
            {
              headers: {
                Authorization: localStorage.getItem("auth-token"),
              },
            },
          )
          .then((res) => {
            if (res.data.error) return;
            const user: CurrentUserType = res.data.you;
            setLoggedUser(user);
            user.friend.map((ele) => {
              if (ele.user2_id == currentUser?.user_id) {
                setIsFriend(true);
              }
            });
            setLoading(false);
          });
      }
    } else {
      navigator("/");
    }
  }, [navigator]);

  return loading ? (
    <div className="grid place-items-center w-full h-screen">
      <span className="loading loading-infinity loading-lg"></span>
    </div>
  ) : (
    <>
      {overlay != null ? (
        <FullPostPopup post_id={overlay} overlay={setOverlay} />
      ) : null}

      <div className="flex lg:flex-row flex-col-reverse lg:gap-10 gap-0">
        <div className="fixed text-transparent inset-x-12 inset-y-12 lg:inset-x-1/4 w-fit h-fit flex-col flex justify-center items-center text-7xl lg:text-9xl font-black tracking-wide z-[-1]">
          <h1 className="bg-gradient-to-r from-primary/50 via-primary to-primary/50 bg-clip-text">
            PROFILE
          </h1>
        </div>

        <div className="p-3 xl:p-10 grow lg:basis-2/3 w-full">
          <h1 className="text-xl font-semibold lg:hidden block p-5">
            Your Posts{" "}
          </h1>
          <div className="pb-10 gap-3 grid grid-cols-3 lg:px-5 py-0 lg:pt-10 px-3 w-full">
            {currentUser?.post.length == 0 ? (
              <h1 className="text-xl text-primary flex gap-3 justify-center w-full items-center">
                <HiMiniEyeSlash /> No posts{" "}
              </h1>
            ) : (
              currentUser?.post.map((ele) => {
                return ele.post_image == "NO IMAGE" ? (
                  <div
                    className="aspect-square rounded-lg bg-gradient-to-b text-white backdrop-blur-sm shadow-2xl hover:scale-110 duration-200 p-3 lg:p-5 overflow-hidden from-slate-700 text-xs lg:text-base to-slate-700/10 group relative"
                    key={ele.post_id}
                  >
                    {ele.description}
                    <div className="w-full hidden opacity-0 justify-center gap-1 flex-wrap lg:gap-3 items-center group-hover:opacity-100 duration-200 h-full bg-base-300/50 group-hover:flex absolute inset-0">
                      <HiMiniEye
                        onClick={() => setOverlay(ele.post_id)}
                        className="text-2xl text-primary rounded-lg p-1 bg-base-300"
                      />
                      {id == "self" ? (
                        <>
                          <HiMiniPencilSquare className="text-2xl text-warning rounded-lg p-1 bg-base-300" />
                          <HiMiniTrash className="text-2xl text-error rounded-lg p-1 bg-base-300" />
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ backgroundImage: `url('${ele.post_image}')` }}
                    key={ele.post_id}
                    className={`hover:scale-110 shadow-2xl duration-200 group bg-center bg-cover aspect-square rounded-lg bg-base-300  `}
                  >
                    <div className="w-full hidden opacity-0 justify-center gap-1 flex-wrap lg:gap-2 items-center group-hover:opacity-100 duration-200 h-full bg-base-300/50 group-hover:flex">
                      <HiMiniEye
                        onClick={() => setOverlay(ele.post_id)}
                        className="text-2xl text-primary rounded-lg p-1 bg-base-300"
                      />
                      {id == "self" ? (
                        <>
                          <HiMiniPencilSquare className="text-2xl text-warning rounded-lg p-1 bg-base-300" />
                          <HiMiniTrash className="text-2xl text-error rounded-lg p-1 bg-base-300" />
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="lg:basis-1/2 h-fit gap-5 basis-0 bg-base-300/70 px-5 rounded-xl lg:bg-base-300 lg:mr-10 lg:ml-0 mx-5 flex flex-col py-10 items-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {currentUser?.profile_image == "NO IMAGE" ? (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-24">
                    <span className="text-4xl">
                      {currentUser?.name.split(" ")[0]?.[0]?.toUpperCase()}
                      {currentUser?.name.split(" ")[1]?.[0].toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src={currentUser?.profile_image} loading="lazy" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-semibold">{currentUser?.name}</h1>
          {isFriend == true ? (
            <button className="btn btn-outline btn-primary">Un Follow</button>
          ) : (
            <button className="btn btn-primary">Follow</button>
          )}
          <div className="divider italic">Personal Details</div>
          <div className="flex flex-col w-full px-2 lg:px-5 gap-5">
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl">
                <HiMapPin /> Address
              </b>{" "}
              {currentUser?.address}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl">
                <HiEnvelope /> Email
              </b>{" "}
              {currentUser?.email}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl">
                <HiDeviceMobile /> Phone
              </b>{" "}
              {currentUser?.phone}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl">
                <HiMiniIdentification /> Bio
              </b>{" "}
              {currentUser?.bio}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl">
                <HiMiniHeart /> Appreciate Mode
              </b>{" "}
              {currentUser?.appreciate_mode}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserProfile;
