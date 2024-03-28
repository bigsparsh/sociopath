import axios from "axios";
import { useEffect, useState } from "react";
import { HiDeviceMobile } from "react-icons/hi";
import { HiEnvelope, HiMapPin, HiMiniHeart, HiMiniIdentification } from "react-icons/hi2";
import CurrentUserType from "../types/CurrentUserType"

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axios.get(import.meta.env.VITE_BACKEND_URL + "/user/me?jwt=" + localStorage.getItem("auth-token"), {
      headers: {
        Authorization: localStorage.getItem("auth-token")
      }
    }).then((res) => {
      if (res.data.error) return;
      setCurrentUser(res.data.you);
      setLoading(false);
    })
  }, [])

  return loading ?
    <div className="grid place-items-center w-full h-screen">
      <span className="loading loading-infinity loading-lg"></span>
    </div>
    :
    <>
      <div className="flex lg:flex-row flex-col-reverse lg:gap-10 gap-0">
        < div className="p-3 xl:p-10 grow lg:basis-2/3 w-full" >
          <h1 className="text-3xl font-bold mt-5 lg:mt-0 px-5 lg:px-0">Their Posts</h1>
          <div className="py-10 gap-3 grid grid-cols-3 lg:px-5 px-3 w-full">
            {
              currentUser?.post.map((ele) => {
                return ele.post_image == "NO IMAGE" ?
                  <div className="aspect-square rounded-lg bg-gradient-to-t hover:scale-110 duration-200 p-3 lg:p-5 overflow-hidden from-base-100 text-xs lg:text-base to-base-300">{ele.description}</div>
                  :
                  <div style={{ backgroundImage: `url('${ele.post_image}')` }} key={ele.post_id} className={`hover:scale-110 duration-200 bg-center bg-cover aspect-square rounded-lg bg-base-300  `}></div>
              })
            }
          </div>

        </div >
        <div className="lg:basis-1/2 gap-5 basis-0 px-5 rounded-xl bg-base-300 lg:mr-10 lg:ml-0 mx-5 flex flex-col  py-10 items-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {
                currentUser?.profile_image == "NO IMAGE" ?
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-24">
                      <span className="text-4xl">{currentUser?.name.split(" ")[0]?.[0]?.toUpperCase()}{currentUser?.name.split(" ")[1]?.[0].toUpperCase()}</span>
                    </div>
                  </div>
                  :
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={currentUser?.profile_image} loading="lazy" />
                    </div>
                  </div>
              }
            </div>
          </div>
          <h1 className="text-4xl font-semibold">{currentUser?.name}</h1>
          <div className="divider italic">Personal Details</div>
          <div className="flex flex-col w-full px-2 lg:px-5 gap-5">
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl"><HiMapPin /> Address</b> {currentUser?.address}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl"><HiEnvelope /> Email</b> {currentUser?.email}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl"><HiDeviceMobile /> Phone</b> {currentUser?.phone}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl"><HiMiniIdentification /> Bio</b> {currentUser?.bio}
            </h1>
            <h1 className="lg:text-base text-sm">
              <b className="flex gap-2 items-center text-primary text-base lg:text-xl"><HiMiniHeart /> Appreciate Mode</b> {currentUser?.appreciate_mode}
            </h1>
          </div>
          <div className="divider"></div>
        </div>
      </div >

    </>
}
export default UserProfile;
