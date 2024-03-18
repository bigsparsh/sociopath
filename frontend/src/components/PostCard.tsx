import axios from "axios";
import { useEffect, useState } from "react"
import { HiChatBubbleLeft, HiMiniHandThumbDown, HiMiniHandThumbUp } from "react-icons/hi2"

const PostCard = ({ current_user, user, post, comment, preference, render }) => {

  const [utilCounts, setUtilCounts] = useState([0, 0, 0]);
  const [currentPreference, setCurrentPreference] = useState(false);

  useEffect(() => {

    let likes = 0, dislikes = 0, comments = 0;
    post.preference.map((ele) => {
      if (ele.preference == true) {
        likes++;
      }
    })
    dislikes = post.preference.length - likes;
    comments = comment.length;
    setUtilCounts([likes, dislikes, comments]);



  }, [comment, post])

  return (
    <div className={post.post_image == "NO IMAGE" ? `flex flex-col bg-base-300 rounded-xl overflow-hidden shadow-xl  max-h-[600px]` : `flex flex-col bg-base-300 rounded-xl overflow-hidden shadow-xl  h-[600px]`}>
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

      </div>

      {
        post.post_image == "NO IMAGE" ? null :
          <div className="bg-cover bg-center grow " style={{ backgroundImage: `url(${post.post_image})` }}></div>

      }
      <div className="text-cont max-h-[200px] overflow-auto">
        <p className="p-5">{post.description}</p>
      </div>
      <p className="text-xs opacity-50 px-5 pt-3">Posted at {post.created_at} </p>
      <div className="flex bg-base-300 p-5 lg:justify-start justify-evenly gap-16 items-center">
        <button className="btn btn-ghost flex gap-3 items-center" id="like" onClick={checkPreference}>
          <HiMiniHandThumbUp className={`text-xl pointer-events-none` + (currentP == true ? ` text-green-500` : "")} /> {utilCounts[0]}
        </button>
        <button className="btn btn-ghost flex gap-3 items-center" id="dislike" onClick={checkPreference}>
          <HiMiniHandThumbDown className={`text-xl pointer-events-none` + (currentP == false ? ` text-red-500` : "")} /> {utilCounts[1]}
        </button>
        <button className="btn btn-ghost flex gap-3 items-center">
          <HiChatBubbleLeft className="text-xl" /> {utilCounts[2]}
        </button>
      </div>
    </div >
  )
}
export default PostCard
