import axios from "axios";
import { useEffect, useState } from "react"
import { HiChatBubbleLeft, HiMiniHandThumbDown, HiMiniHandThumbUp } from "react-icons/hi2"

const PostCard = ({ current_user, description, post_image, id, user, created_at, comment, preference, render }) => {

  const [ld, setLd] = useState([0, 0]);
  const [currentP, setCurrentP] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followLoader, setFollowLoader] = useState(false);
  const [revFollow, setRevFollow] = useState(false);
  useEffect(() => {
    if (preference) {
      let positive = 0;
      const comments = comment.length;

      preference.map((ele) => {
        if (ele.preference) {
          positive++;
        }
      })
      const negative = preference.length - positive;
      setLd([positive, negative, comments]);

      current_user.post_preference.map((ele) => {
        if (ele.post_id == id) {
          setCurrentP(ele.preference);
        }
      })
      user.friend.map((ele) => {
        if (ele.user2_id == current_user.user_id) {
          setRevFollow(true);
        }
      })
      current_user.friend.map((ele) => {
        if (ele.user2_id == user.user_id) {
          setFollowing(true);
          setRevFollow(false);
        }
      })



    }
  }, [preference, comment, id, user, current_user])

  const checkPreference = (e) => {
    const target = e.target.id;
    if (target == "dislike") {
      setLd([ld[0], ld[1] + 1]);
    } else if (target == "like") {
      setLd([ld[0] + 1, ld[1]]);
    }
  }

  const do_follow = (e) => {
    setFollowLoader(true);
    if (current_user.user_id == user.user_id) return;
    const target = e.target.id;
    if (target == "follow") {
      axios.post(import.meta.env.VITE_BACKEND_URL + "/friend/create", {
        user1_id: current_user.user_id,
        user2_id: user.user_id
      }, {
        headers: {
          Authorization: localStorage.getItem("auth-token")
        }
      }).then((res) => {
        if (res.data.error) return;
        setFollowing(true);
        setFollowLoader(false);
        render(e => !e);
      })
    }
    else if (target == "unfollow") {
      axios.delete(import.meta.env.VITE_BACKEND_URL + "/friend/delete", {
        data: {
          user1_id: current_user.user_id,
          user2_id: user.user_id
        },
        headers: {
          Authorization: localStorage.getItem("auth-token")
        }
      }).then((res) => {
        if (res.data.error) return;
        console.log("Hello")
        setFollowing(false);
        setFollowLoader(false);
        render(e => !e);
      });
    }
  }

  return (
    <div className={post_image == "NO IMAGE" ? `flex flex-col bg-base-300 rounded-xl overflow-hidden shadow-xl  max-h-[600px]` : `flex flex-col bg-base-300 rounded-xl overflow-hidden shadow-xl  h-[600px]`}>
      <div className="p-5 flex justify-between items-center">
        <div className="profile flex gap-5 items-center">

          {
            user.profile_image == "NO IMAGE" ?
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-12">
                  <span className="text-lg">{user.name.split(" ")[0][0].toUpperCase()}{user.name.split(" ")[1][0].toUpperCase()}</span>
                </div>
              </div>
              :
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img src={user.profile_image} loading="lazy" />
                </div>
              </div>
          }
          <div className="flex flex-col">
            {!user ?
              <><div className="w-52 rounded-full h-3 skeleton"></div>
                <div className="w-24 rounded-full h-3 skeleton"></div></> :
              <>

                <h1 className="text-xl">{user.name}</h1>
                <p className="text-sm">{user.email}</p></>}
          </div>
        </div>
        <div className="indicator">
          {
            revFollow ?
              <span className="indicator-item badge badge-primary indicator-start">Follows you</span>
              : null
          }
          {current_user.user_id != user.user_id ?
            following ?
              followLoader ?
                <button disabled className="btn btn-secondary btn-outline" onClick={do_follow} id="unfollow">
                  Unfollow <span className="loading loading-spinner loading-md"></span>
                </button> :
                <button className="btn btn-secondary btn-outline" onClick={do_follow} id="unfollow">
                  Unfollow
                </button>
              :
              followLoader ?
                <button disabled className="btn btn-primary btn-outline" onClick={do_follow} id="follow">
                  Follow <span className="loading loading-spinner loading-md"></span>
                </button> :
                <button className="btn btn-primary btn-outline" onClick={do_follow} id="follow">
                  Follow
                </button>
            : null
          }</div>
      </div>

      {
        post_image == "NO IMAGE" ? null :
          <div className="bg-cover bg-center grow " style={{ backgroundImage: `url(${post_image})` }}></div>

      }
      <div className="text-cont max-h-[200px] overflow-auto">
        <p className="p-5">{description}</p>
      </div>
      <p className="text-xs opacity-50 px-5 pt-3">Posted at {created_at} </p>
      <div className="flex bg-base-300 p-5 lg:justify-start justify-evenly gap-16 items-center">
        <button className="btn btn-ghost flex gap-3 items-center" id="like" onClick={checkPreference}>
          <HiMiniHandThumbUp className={`text-xl pointer-events-none` + (currentP == true ? ` text-green-500` : "")} /> {ld[0]}
        </button>
        <button className="btn btn-ghost flex gap-3 items-center" id="dislike" onClick={checkPreference}>
          <HiMiniHandThumbDown className={`text-xl pointer-events-none` + (currentP == false ? ` text-red-500` : "")} /> {ld[1]}
        </button>
        <button className="btn btn-ghost flex gap-3 items-center">
          <HiChatBubbleLeft className="text-xl" /> {ld[2]}
        </button>
      </div>
    </div >
  )
}
export default PostCard
