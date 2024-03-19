import { useEffect, useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";
import { removeCommentPreference, updateCommentPreference } from "../utils";

const CommentCard = ({ comment, user, preference, id, current_user, comment_render, feed_render }) => {

  const [utilCounts, setUtilCounts] = useState([0, 0]);
  const [currentPreference, setCurrentPreference] = useState(null);
  const [preferenceLoader, setPreferenceLoader] = useState(false);

  useEffect(() => {
    let likes = 0, dislikes = 0;
    preference.map((ele) => {
      if (ele.preference == true) {
        likes++;
      }
    })
    dislikes = preference.length - likes;
    setUtilCounts([likes, dislikes]);

    current_user.comment_preference.map((ele) => {
      if (ele.comment_id == id) {
        setCurrentPreference(ele.preference);
      }
    })

  }, [comment, preference, id, current_user, currentPreference])

  let debounceTimeout;

  const checkPreference = async (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const target = e.target.id;
      if (currentPreference == true && target == "like" || currentPreference == false && target == "dislike") {
        setPreferenceLoader(true);
        await removeCommentPreference(current_user.user_id, id).then(
          () => {
            comment_render(e => !e);

            feed_render(e => !e);
            setCurrentPreference(null);
            setPreferenceLoader(false);
          }
        )
        return;
      }
      let preference;
      if (target == "like") {
        preference = true;

      }
      else if (target == "dislike") {
        preference = false;
      }
      else {
        return;
      }
      setPreferenceLoader(true);
      await updateCommentPreference(current_user.user_id, id, preference).then(() => {
        comment_render(e => !e);

        feed_render(e => !e);
        setPreferenceLoader(false);
      })
    }, 250);
  }

  return <div className="flex flex-col gap-5 rounded-xl bg-base-300 p-4">
    <div className="border-b pb-3 border-gray-700 flex justify-between">

      <div className="profile flex gap-3  items-center">

        {
          user.profile_image == "NO IMAGE" ?
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12">
                <span className="text-md">{user.name.split(" ")[0][0].toUpperCase()}{user.name.split(" ")[1][0].toUpperCase()}</span>
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

      <div className="flex flex-col">
        {
          preferenceLoader ?
            <>
              <button className="btn btn-sm btn-ghost flex gap-4 items-center skeleton" disabled>
                <HiOutlineChevronUp className="text-green-400 text-lg" />
                {utilCounts[0]}
              </button>
              <button className="btn btn-sm btn-ghost flex gap-4 items-center skeleton" disabled>
                <HiOutlineChevronDown className="text-red-400 text-lg" />
                {utilCounts[1]}
              </button>
            </> :
            <>
              <button className="btn btn-sm btn-ghost flex gap-4 items-center" id="like" onClick={checkPreference}>
                <HiOutlineChevronUp className={`text-xl pointer-events-none` + (currentPreference == true ? ` text-green-500` : "")} />
                {utilCounts[0]}
              </button>
              <button className="btn btn-sm btn-ghost flex gap-4 items-center" id="dislike" onClick={checkPreference}>
                <HiOutlineChevronDown className={`text-xl pointer-events-none` + (currentPreference == false ? ` text-red-500` : "")} />
                {utilCounts[1]}
              </button>
            </>
        }
      </div>

    </div>
    <div className="space-y-4">
      <p className="text-sm">{comment.message}</p>
      <p className="text-xs opacity-50">{comment.created_at}</p>
    </div>
  </div>
}
export default CommentCard;
