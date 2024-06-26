import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  HiChatBubbleLeft,
  HiKey,
  HiMiniHandThumbDown,
  HiMiniHandThumbUp,
  HiMiniQuestionMarkCircle,
} from "react-icons/hi2";
import { removePostPreference, updatePostPreference } from "../utils";
import CommentSection from "../pages/CommentSection";
import CurrentUserType from "../types/CurrentUserType";
import PostType from "../types/PostType";
import { useNavigate } from "react-router-dom";

interface post_card {
  current_user: CurrentUserType;
  user: PostType["user"];
  tags: PostType["tag"];
  post: {
    post_id: string;
    is_answered: boolean;
    is_question: boolean;
    description: string;
    created_at: string;
    post_image: string;
    comment_enabled: boolean;
    preference: {
      p_preference_id: string;
      post_id: string;
      preference: boolean;
      user_id: string;
      user: CurrentUserType;
    }[];
  };
  comment: PostType["comment"];
  feed_render: Dispatch<SetStateAction<boolean | null>> | null;
  right_sec: Dispatch<SetStateAction<JSX.Element | null | undefined>> | null;
  overlay: Dispatch<SetStateAction<string | undefined | null>> | null;
}

const PostCard = ({
  current_user,
  user,
  post,
  comment,
  tags,
  feed_render,
  right_sec,
  overlay,
}: post_card) => {
  const [utilCounts, setUtilCounts] = useState<number[]>([0, 0]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [currentPreference, setCurrentPreference] = useState<boolean | null>(
    null,
  );
  const [debouncer, setDebouncer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const navigator = useNavigate();

  useEffect(() => {
    let likes = 0,
      dislikes = 0;
    post.preference.map((ele) => {
      if (ele.preference == true && ele.user.delete == false) {
        likes++;
      }
      if (ele.preference == false && ele.user.delete == false) {
        dislikes++;
      }
    });
    setCommentCount(comment.filter((ele) => ele.user.delete == false).length);
    setUtilCounts([likes, dislikes]);

    current_user.post_preference.map((ele) => {
      if (ele.post_id == post.post_id) {
        setCurrentPreference(ele.preference);
      }
    });
  }, [post]);

  const showComments = () => {
    if (!right_sec) return;
    feed_render && feed_render((e) => !e);
    right_sec(
      <CommentSection
        post_id={post.post_id}
        is_question={post.is_question}
        close={right_sec}
        feed_render={feed_render}
        current_user={current_user}
        comment_count={setCommentCount}
      />,
    );
  };

  const checkPreference = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let cpBuffer: null | boolean;
    if (
      currentPreference == true &&
      (e.target as HTMLButtonElement).id == "like"
    ) {
      cpBuffer = null;
      setCurrentPreference(null);
      setUtilCounts([utilCounts[0] - 1, utilCounts[1], utilCounts[2]]);
    }
    if (
      currentPreference == false &&
      (e.target as HTMLButtonElement).id == "dislike"
    ) {
      cpBuffer = null;
      setCurrentPreference(null);
      setUtilCounts([utilCounts[0], utilCounts[1] - 1, utilCounts[2]]);
    }
    if (
      currentPreference == true &&
      (e.target as HTMLButtonElement).id == "dislike"
    ) {
      cpBuffer = false;
      setCurrentPreference(false);
      setUtilCounts([utilCounts[0] - 1, utilCounts[1] + 1, utilCounts[2]]);
    }
    if (
      currentPreference == false &&
      (e.target as HTMLButtonElement).id == "like"
    ) {
      cpBuffer = true;
      setCurrentPreference(true);
      setUtilCounts([utilCounts[0] + 1, utilCounts[1] - 1, utilCounts[2]]);
    }
    if (
      currentPreference == null &&
      (e.target as HTMLButtonElement).id == "like"
    ) {
      cpBuffer = true;
      setCurrentPreference(true);
      setUtilCounts([utilCounts[0] + 1, utilCounts[1], utilCounts[2]]);
    }
    if (
      currentPreference == null &&
      (e.target as HTMLButtonElement).id == "dislike"
    ) {
      cpBuffer = false;
      setCurrentPreference(false);
      setUtilCounts([utilCounts[0], utilCounts[1] + 1, utilCounts[2]]);
    }

    if (debouncer) {
      clearTimeout(debouncer);
    }
    setDebouncer(
      setTimeout(async () => {
        if (cpBuffer != null) {
          await updatePostPreference(
            current_user.user_id,
            post.post_id,
            cpBuffer,
          );
        } else {
          await removePostPreference(current_user.user_id, post.post_id);
        }
        if (feed_render) feed_render((e) => !e);
      }, 2500),
    );
  };

  return (
    <div
      className={
        post.post_image == "NO IMAGE"
          ? `flex border border-base-100 flex-col bg-base-300 rounded-xl  shadow-xl  max-h-[600px] z-20`
          : `flex flex-col bg-base-300 border border-base-100 rounded-xl shadow-xl relative h-[600px] z-10`
      }
    >
      {post.post_image == "NO IMAGE" ? null : (
        <div
          className="bg-cover bg-center grow absolute inset-0 scale-110 blur-3xl opacity-30 z-[-10]   "
          style={{ backgroundImage: `url(${post.post_image})` }}
        ></div>
      )}

      <div className="p-5 flex justify-between items-center bg-base-300 rounded-t-xl">
        <div
          className="profile cursor-pointer flex gap-5 items-center"
          onClick={() => {
            navigator("/user/profile/" + user.user_id);
          }}
        >
          {user.profile_image == "NO IMAGE" ? (
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12">
                <span className="text-lg">
                  {user.name.split(" ")[0][0].toUpperCase()}
                  {user.name.split(" ")[1][0].toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={user.profile_image} loading="lazy" />
              </div>
            </div>
          )}
          <div className="flex flex-col">
            {!user ? (
              <>
                <div className="w-52 rounded-full h-3 skeleton"></div>
                <div className="w-24 rounded-full h-3 skeleton"></div>
              </>
            ) : (
              <>
                <h1 className="text-lg lg:text-xl">{user.name}</h1>
                <p className="text-xs lg:text-sm">{user.email}</p>
              </>
            )}
          </div>
        </div>
        {post.is_question ? (
          <HiMiniQuestionMarkCircle
            className={
              `text-2xl ` +
              (post.is_answered == true ? "text-success" : "text-error")
            }
          />
        ) : null}
      </div>

      {post.post_image == "NO IMAGE" ? null : (
        <div
          className="bg-cover bg-center grow hover:opacity-70 cursor-pointer duration-200"
          onClick={() => {
            if (overlay) overlay(post.post_image);
          }}
          style={{ backgroundImage: `url(${post.post_image})` }}
        ></div>
      )}
      <div className="text-cont max-h-[200px] overflow-auto bg-base-300">
        <p className="p-5">{post.description}</p>
      </div>
      <p className="text-xs dark:text-white/30 text-black/30  px-5 pt-3 bg-base-300">
        Posted at {post.created_at}{" "}
      </p>
      {tags.length != 0 ? (
        <div className="flex gap-3 bg-base-300 overflow-x-auto pt-5 pb-3 px-5">
          {tags.map((ele) => (
            <div
              className="badge badge-neutral text-nowrap cursor-pointer"
              key={ele.tag_id}
              onClick={(e) => {
                right_sec &&
                  navigator(
                    "/user/feed/search/Tags?param=" +
                    (e.target as HTMLDivElement).innerText,
                  );
              }}
            >
              {" "}
              {ele.name}{" "}
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex bg-base-300 px-5 py-3 justify-start lg:gap-16 items-center rounded-b-xl">
        <button
          className="btn btn-ghost btn-sm flex gap-3 items-center"
          id="like"
          onClick={checkPreference}
        >
          <HiMiniHandThumbUp
            className={
              `text-xl pointer-events-none` +
              (currentPreference == true ? ` text-green-500` : "")
            }
          />{" "}
          {utilCounts[0]}
        </button>
        <button
          className="btn btn-sm btn-ghost flex gap-3 items-center"
          id="dislike"
          onClick={checkPreference}
        >
          <HiMiniHandThumbDown
            className={
              `text-xl pointer-events-none` +
              (currentPreference == false ? ` text-red-500` : "")
            }
          />{" "}
          {utilCounts[1]}
        </button>
        {post.is_question == true ? (
          <button
            className="btn btn-sm btn-ghost flex gap-3 items-center"
            onClick={showComments}
          >
            <HiKey className={"text-xl"} /> {commentCount}
          </button>
        ) : post.comment_enabled == true ? (
          <button
            className="btn btn-ghost btn-sm flex gap-3 items-center"
            onClick={showComments}
          >
            <HiChatBubbleLeft className="text-xl" /> {commentCount}
          </button>
        ) : (
          <div
            className="tooltip"
            data-tip="The creator of this post has diabled commenting"
          >
            <button
              className="btn btn-ghost btn-sm flex gap-3 items-center"
              disabled
            >
              <HiChatBubbleLeft className="text-xl" /> {commentCount}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PostCard;
