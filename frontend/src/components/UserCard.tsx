import axios from "axios";
import UserType from "../types/UserType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserType from "../types/CurrentUserType";
import FriendType from "../types/FriendType";
const UserCard = ({
  user,
  current_user,
  alertMessage,
}: {
  user: UserType;
  current_user: CurrentUserType;
  alertMessage: Dispatch<SetStateAction<string | null>>;
}) => {
  const navigator = useNavigate();
  const [isFriend, setIsFriend] = useState<FriendType | null>();
  useEffect(() => {
    let isYourFriend: FriendType | null = null;
    user &&
      user.friend.forEach((ele) => {
        if (ele.user2_id == current_user.user_id) {
          isYourFriend = FriendType.FOLLOWER;
          return;
        }
      });
    current_user.friend.forEach((ele) => {
      if (ele.user2_id == user.user_id) {
        if (ele.mutual == true) {
          isYourFriend = FriendType.FRIEND;
          return;
        }
        isYourFriend = FriendType.FOLLOWING;
        return;
      }
    });
    console.log(isYourFriend);
    setIsFriend(isYourFriend);
  }, []);
  const makeFriend = async () => {
    if (isFriend == FriendType.FRIEND || isFriend == FriendType.FOLLOWING) {
      if (isFriend == FriendType.FRIEND) {
        setIsFriend(FriendType.FOLLOWER);
        user._count.user2 -= 1;
      }
      if (isFriend == FriendType.FOLLOWING) {
        setIsFriend(null);
        user._count.user2 -= 1;
      }
      await axios.delete(import.meta.env.VITE_BACKEND_URL + "/friend/delete", {
        data: {
          user1_id: current_user.user_id,
          user2_id: user.user_id,
        },
        headers: {
          Authorization: localStorage.getItem("auth-token"),
        },
      });
      return;
    }
    if (isFriend == FriendType.FOLLOWER) {
      setIsFriend(FriendType.FRIEND);
      user._count.user2 += 1;
    }
    if (isFriend == null) {
      setIsFriend(FriendType.FOLLOWING);
      user._count.user2 += 1;
    }
    await axios
      .post(
        import.meta.env.VITE_BACKEND_URL + "/friend/create",
        {
          user1_id: current_user.user_id,
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
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigator("/user/profile/" + user.user_id)}
        >
          See Profile
        </button>
        {current_user.user_id == user.user_id ? null : isFriend == null ? (
          <button className="btn btn-sm btn-primary" onClick={makeFriend}>
            Add Friend
          </button>
        ) : isFriend == FriendType.FRIEND ? (
          <button className="btn btn-sm btn-error" onClick={makeFriend}>
            Unfriend
          </button>
        ) : isFriend == FriendType.FOLLOWER ? (
          <button className="btn btn-sm btn-accent" onClick={makeFriend}>
            Follow Back
          </button>
        ) : isFriend == FriendType.FOLLOWING ? (
          <button className="btn btn-sm btn-secondary" onClick={makeFriend}>
            Following
          </button>
        ) : null}
      </div>
    </div>
  );
};
export default UserCard;
