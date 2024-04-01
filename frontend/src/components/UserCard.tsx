import axios from "axios";
import UserType from "../types/UserType";
import { Dispatch, SetStateAction } from "react";
const UserCard = ({
  user,
  current_user_id,
  alertMessage,
}: {
  user: UserType;
  current_user_id: string;
  alertMessage: Dispatch<SetStateAction<string | null>>;
}) => {
  const makeFriend = async () => {
    await axios
      .post(
        import.meta.env.VITE_BACKEND_URL + "/friend/create",
        {
          user1_id: current_user_id,
          user2_id: user.user_id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
      .then((res) => {
        if (res.data.error) {
          alertMessage(res.data.error);
          return;
        }
        alertMessage(res.data.message);
        setTimeout(() => alertMessage(null), 3000);
      });
  };
  return (
    <div className="flex items-center flex-col lg:flex-row gap-5 p-3 rounded-xl bg-base-300">
      <div className="flex grow gap-5 w-full lg:w-fit">
        <div className="avatar">
          <div className="lg:w-24 w-20 rounded-2xl ">
            {user?.profile_image == "NO IMAGE" ? (
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-2xl lg:w-24 w-20">
                  <span className="text-4xl">
                    {user?.name.split(" ")[0]?.[0]?.toUpperCase()}
                    {user?.name.split(" ")[1]?.[0].toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="avatar">
                <div className="lg:w-24 w-20 rounded-2xl">
                  <img src={user?.profile_image} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold mb-3">{user.name}</h1>
            <h2>{user.email}</h2>
            <h2 className="text-primary">
              {user._count.user2} Followers | {user._count.post} Posts
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-row lg:flex-col h-full gap-3 justify-evenly ">
        <button className="btn btn-sm btn-primary">See Profile</button>
        <button className="btn btn-sm btn-primary" onClick={makeFriend}>
          Make Friend
        </button>
      </div>
    </div>
  );
};
export default UserCard;
