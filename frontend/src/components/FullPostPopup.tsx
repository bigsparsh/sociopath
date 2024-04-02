import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HiEyeSlash, HiMiniXMark } from "react-icons/hi2";
import PostType from "../types/PostType";
import axios from "axios";
import CommentCard from "./CommentCard";
import CommentType from "../types/CommentType";

const FullPostPopup = ({
  post_id,
  overlay,
}: {
  post_id: string;
  overlay: Dispatch<SetStateAction<string | null | undefined>>;
}) => {
  const [post, setPost] = useState<PostType>();
  const [comment, setComment] = useState<CommentType[]>();
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/post/get?filterId=" + post_id, {
        headers: {
          Authorization: localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        if (res.data.error) return;
        setPost(res.data.post);
      });
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL + "/comment/get?filterId=" + post_id,
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
      .then((res) => {
        if (res.data.error) return;
        setComment(res.data.comments);
      });
  }, [post_id]);

  return (
    <div className="fixed inset-0  bg-base-100/50 backdrop-blur-xl overflow-y-scroll z-50 flex justify-center items-start lg:items-center ">
      <button
        className="btn btn-square fixed right-10 top-10 btn-error"
        onClick={() => overlay(null)}
      >
        <HiMiniXMark className="text-3xl" />
      </button>
      <div className="flex w-screen lg:h-screen  overflow-y-scroll lg:overflow-hidden lg:flex-row flex-col">
        <div className="flex flex-col basis-3/4 ">
          {post?.post_image == "NO IMAGE" ? (
            <div className="bg-contain flex items-center justify-center gap-4 text-2xl text-semibold text-primary bg-base-200 lg:bg-base-300 lg:basis-2/3 h-[450px] bg-center bg-no-repeat lg:my-4 lg:rounded-r-xl">
              <HiEyeSlash />
              NO IMAGE
            </div>
          ) : (
            <div
              className="bg-contain bg-base-200 lg:bg-base-300 lg:basis-2/3 h-[450px] bg-center bg-no-repeat lg:my-4 lg:rounded-r-xl"
              style={{ backgroundImage: `url(${post?.post_image})` }}
            ></div>
          )}
          <div className="flex bg-base-300 p-5 flex-col basis-1/3 overflow-y-auto lg:rounded-tr-xl">
            <div className="p-3 flex gap-5 w-fit items-center bg-base-300 rounded-xl">
              {!post?.user ? (
                <div className="avatar">
                  <div className="w-12 skeleton rounded-full"></div>
                </div>
              ) : post?.user.profile_image == "NO IMAGE" ? (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-lg">
                      {post?.user.name.split(" ")[0][0].toUpperCase()}
                      {post?.user.name.split(" ")[1][0].toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={post?.user.profile_image} loading="lazy" />
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                {!post?.user ? (
                  <>
                    <div className="w-52 rounded-full h-3 skeleton"></div>
                    <div className="w-24 rounded-full h-3 skeleton"></div>
                  </>
                ) : (
                  <>
                    <h1 className="text-xl">{post?.user.name}</h1>
                    <p className="text-sm">{post?.user.email}</p>
                  </>
                )}
              </div>
            </div>
            <div className="divider"></div>
            {post?.description && post?.description ? (
              <>
                <p className="px-5 mb-5">{post?.description}</p>
                <p className="px-5 opacity-50">{post?.created_at}</p>{" "}
              </>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col basis-1/4">
          <div className="h-full w-full flex flex-col gap-3 py-10 px-3 overflow-y-auto">
            <h1 className="text-2xl font-semibold mb-3">Comments</h1>
            {comment ? (
              comment.map((ele) => {
                return (
                  <CommentCard
                    comment={{
                      comment_id: ele.comment_id,
                      message: ele.message,
                      created_at: String(new Date(ele.created_at)),
                    }}
                    preference={ele.preference}
                    user={ele.user}
                    id={ele.comment_id}
                    current_user={null}
                    comment_render={null}
                    key={ele.comment_id}
                  />
                );
              })
            ) : (
              <div className="h-1/3 w-full grid place-items-center">
                <span className="loading loading-ring loading-lg loading-primary"></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FullPostPopup;
