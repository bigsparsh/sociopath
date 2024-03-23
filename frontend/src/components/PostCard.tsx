import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { HiChatBubbleLeft, HiMiniHandThumbDown, HiMiniHandThumbUp } from "react-icons/hi2"
import { removePostPreference, updatePostPreference } from "../utils";
import CommentSection from "../pages/CommentSection";
import CurrentUserType from "../types/CurrentUserType"
import PostType from "../types/PostType"

interface post_card {
  current_user: CurrentUserType;
  user: PostType["user"];
  post: {
    post_id: string;
    description: string;
    created_at: string;
    post_image: string;
    preference: {
      p_preference_id: string;
      post_id: string;
      preference: boolean;
      user_id: string;
    }[];
  };
  comment: PostType["comment"];
  feed_render: Dispatch<SetStateAction<boolean>>;
  right_sec: Dispatch<SetStateAction<JSX.Element | null | undefined>>;
}

const PostCard = ({ current_user, user, post, comment, feed_render, right_sec }: post_card) => {

  const [utilCounts, setUtilCounts] = useState<number[]>([0, 0, 0]);
  const [currentPreference, setCurrentPreference] = useState<boolean | null>(null);
  const [preferenceLoader, setPreferenceLoader] = useState<boolean>(false);

  console.log(utilCounts, setUtilCounts);
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

    current_user.post_preference.map((ele) => {
      if (ele.post_id == post.post_id) {
        setCurrentPreference(ele.preference);
      }
    })
  }, [comment, post, current_user, feed_render])

  const showComments = () => {
    right_sec(<CommentSection post_id={post.post_id} close={right_sec} feed_render={feed_render} />)
  }

  let debounceTimeout: ReturnType<typeof setTimeout>;

  const checkPreference = async (e: React.MouseEvent<HTMLButtonElement>) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const target = (e.target as HTMLButtonElement).id;
      if (currentPreference == true && target == "like" || currentPreference == false && target == "dislike") {
        setPreferenceLoader(true);
        await removePostPreference(current_user.user_id, post.post_id).then(
          () => {
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
      await updatePostPreference(current_user.user_id, post.post_id, preference).then(() => {
        feed_render(e => !e);
        setPreferenceLoader(false);
      })
    }, 100);
  }

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
      <div className="flex bg-base-300 p-5 justify-start lg:gap-16 items-center">
        {
          preferenceLoader ?
            <>
              <button className="btn btn-ghost flex gap-3 items-center skeleton" id="like" disabled>
                <HiMiniHandThumbUp className={`text-xl pointer-events-none` + (currentPreference == true ? ` text-green-500` : "")} /> {utilCounts[0]}
              </button>
              <button className="btn btn-ghost flex gap-3 items-center skeleton" disabled id="dislike">
                <HiMiniHandThumbDown className={`text-xl pointer-events-none` + (currentPreference == false ? ` text-red-500` : "")} /> {utilCounts[1]}
              </button>
              <button className="btn btn-ghost flex gap-3 items-center skeleton" disabled>
                <HiChatBubbleLeft className="text-xl" /> {utilCounts[2]}
              </button>
            </> :
            <>
              <button className="btn btn-ghost flex gap-3 items-center" id="like" onClick={checkPreference}>
                <HiMiniHandThumbUp className={`text-xl pointer-events-none` + (currentPreference == true ? ` text-green-500` : "")} /> {utilCounts[0]}
              </button>
              <button className="btn btn-ghost flex gap-3 items-center" id="dislike" onClick={checkPreference}>
                <HiMiniHandThumbDown className={`text-xl pointer-events-none` + (currentPreference == false ? ` text-red-500` : "")} /> {utilCounts[1]}
              </button>
              <button className="btn btn-ghost flex gap-3 items-center" onClick={showComments}>
                <HiChatBubbleLeft className="text-xl" /> {utilCounts[2]}
              </button>
            </>
        }
      </div>
    </div >
  )
}
export default PostCard
