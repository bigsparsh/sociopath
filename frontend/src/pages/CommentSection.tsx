import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import CommentCard from "../components/CommentCard";
import CurrentUserType from "../types/CurrentUserType"
import CommentType from "../types/CommentType"

const CommentSection = ({ post_id, close, feed_render, current_user, comment_count }: {
  post_id: string;
  feed_render: Dispatch<SetStateAction<boolean>>;
  close: Dispatch<SetStateAction<JSX.Element | null | undefined>>;
  current_user: CurrentUserType | null;
  comment_count: Dispatch<SetStateAction<number>>;
}) => {
  const [comment, setComment] = useState<CommentType[]>();
  const [loader, setLoader] = useState<boolean>(true);
  const [_, setCommentRender] = useState<boolean>(true);
  const user_comment = useRef<HTMLTextAreaElement>(null);
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
      feed_render(e => !e);
    })


  }, [post_id]);

  const upload_comment = async () => {
    if ((user_comment.current as HTMLTextAreaElement).value.length < 3) {
      return;
    }
    setLoader(true);
    axios
      .post(
        import.meta.env.VITE_BACKEND_URL + "/comment/create",
        {
          user_id: current_user?.user_id,
          post_id: post_id,
          message: (user_comment.current as HTMLTextAreaElement).value,
        },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
      .then((res) => {
        const currentComments = comment;
        currentComments?.push(res.data.comment);
        console.log(currentComments);
        setComment(currentComments);
        comment_count(e => e + 1);
        setLoader(false);
        setCommentRender(e => !e);
      });

    (user_comment.current as HTMLTextAreaElement).value = "";
  }

  return (
    <div className="h-screen bg-base-300 rounded-l-xl fixed lg:sticky w-full inset-0 lg:top-0 flex flex-col pb-5 lg:pr-5 gap-10 overflow-y-scroll z-20">
      <div className="flex justify-between items-center px-5 sticky top-0 backdrop-blur-xl py-5 z-20">
        <h1 className="text-3xl font-semibold ">Comments</h1>
        <button className="btn btn-ghost " onClick={() => close(null)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="space-y-9 px-5">
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
            loader == false && comment && current_user ?
              comment.map((ele) => {
                return <CommentCard
                  comment={{
                    comment_id: ele.comment_id,
                    message: ele.message,
                    created_at: String(new Date(ele.created_at))
                  }}
                  preference={ele.preference}
                  user={ele.user}
                  id={ele.comment_id}
                  current_user={current_user}
                  comment_render={setCommentRender}
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
