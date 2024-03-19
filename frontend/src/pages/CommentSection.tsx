import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CommentCard from "../components/CommentCard";
import { uploadComment } from "../utils";

const CommentSection = ({ post_id, close, current_user, feed_render }) => {
  const [comment, setComment] = useState(null);
  const [loader, setLoader] = useState(true);
  const [commentRender, setCommentRender] = useState(true);
  const user_comment = useRef(null);
  useEffect(() => {
    setLoader(true);
    axios.get(import.meta.env.VITE_BACKEND_URL + "/comment/get?filterId=" + post_id, {
      headers: {
        Authorization: localStorage.getItem("auth-token")
      }
    }).then((res) => {
      if (res.data.error) return;
      setComment(res.data.comments);
      setLoader(false);
    })
  }, [post_id ,current_user, commentRender, feed_render]);
  const upload_comment = async () => {
    if (user_comment.current.value.length < 3) return;
    setLoader(true);
    uploadComment(current_user.user_id, post_id, user_comment.current.value).then(() => {
      setLoader(false);
    });
  }

  return (
    <div className="h-screen sticky top-0 flex flex-col py-5 pr-5 gap-10 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold ">Comments</h1>
        <button className="btn btn-square btn-ghost" onClick={() => close(null)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="space-y-9">
        <div className="space-y-3">
          <label>Draft your own comment for this post</label>
          <textarea className="textarea textarea-bordered bg-base-300 w-full" placeholder="Your comment" ref={user_comment} ></textarea>
          {loader ?
            <button className="btn">
              <span className="loading loading-spinner"></span>
              loading
            </button> :
            <button className="btn btn-primary btn-sm text-right" onClick={upload_comment}>Comment</button>


          }
        </div>
        <div className="h-full w-full flex flex-col gap-3">
          {
            loader == false ?
              comment.map((ele) => {
                return <CommentCard
                  comment={{
                    comment_id: ele.comment_id,
                    message: ele.message,
                    created_at: ele.created_at
                  }}
                  comment_render={setCommentRender}
                  preference={ele.preference}
                  user={ele.user}
                  feed_render={feed_render}
                  id={ele.comment_id}
                  current_user={current_user}
                  key={ele.comment_id}
                />
              }) :
              <div className="h-1/3 w-full grid place-items-center">
                <span className="loading loading-ring loading-lg loading-primary"></span>

              </div>
          }
        </div>
      </div>
    </div>
  )
}
export default CommentSection;
