import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";
import { removeCommentPreference, updateCommentPreference } from "../utils";
import CommentType from "../types/CommentType";
import CurrentUserType from "../types/CurrentUserType";

const CommentCard = ({
  comment,
  user,
  preference,
  id,
  current_user,
  comment_render,
  is_question,
}: {
  comment: {
    comment_id: string;
    message: string;
    created_at: string;
    post_id: string;
    is_answer: boolean;
  };
  user: CommentType["user"] | null;
  id: string;
  preference: CommentType["preference"] | null;
  current_user: CurrentUserType | null;
  comment_render: Dispatch<SetStateAction<boolean>> | null;
  is_question: boolean;
}) => {
  const [utilCounts, setUtilCounts] = useState<number[]>([0, 0]);
  const [currentPreference, setCurrentPreference] = useState<boolean | null>();
  const [isPostUser, setIsPostUser] = useState<boolean>();
  const [isAnswer, setIsAnswer] = useState<boolean>();
  const [debouncer, setDebouncer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    current_user?.post.map((ele) => {
      if (ele.post_id == comment.post_id) {
        setIsPostUser(true);
      }
    });
    setIsAnswer(comment.is_answer);
    let likes = 0,
      dislikes = 0;
    preference?.map((ele) => {
      if (ele.preference == true) {
        likes++;
      }
    });
    dislikes = (preference?.length || 0) - likes;
    setUtilCounts([likes, dislikes]);

    if (current_user != null) {
      setCurrentPreference(null);
      current_user.comment_preference.map((ele) => {
        if (ele.comment_id == id) {
          setCurrentPreference(ele.preference);
        }
      });
    }
  }, [current_user]);

  const checkPreference = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let cpBuffer: null | boolean = null;
    if (
      currentPreference == true &&
      (e.target as HTMLButtonElement).id == "like"
    ) {
      cpBuffer = null;
      if (is_question == true && isPostUser == true) setIsAnswer(false);
      setUtilCounts([utilCounts[0] - 1, utilCounts[1], utilCounts[2]]);
    }
    if (
      currentPreference == false &&
      (e.target as HTMLButtonElement).id == "dislike"
    ) {
      cpBuffer = null;
      if (is_question == true && isPostUser == true) setIsAnswer(false);
      setUtilCounts([utilCounts[0], utilCounts[1] - 1, utilCounts[2]]);
    }
    if (
      currentPreference == true &&
      (e.target as HTMLButtonElement).id == "dislike"
    ) {
      cpBuffer = false;
      if (is_question == true && isPostUser == true) setIsAnswer(false);
      setUtilCounts([utilCounts[0] - 1, utilCounts[1] + 1, utilCounts[2]]);
    }
    if (
      currentPreference == false &&
      (e.target as HTMLButtonElement).id == "like"
    ) {
      cpBuffer = true;
      if (is_question == true && isPostUser == true) setIsAnswer(true);
      setUtilCounts([utilCounts[0] + 1, utilCounts[1] - 1, utilCounts[2]]);
    }
    if (
      currentPreference == null &&
      (e.target as HTMLButtonElement).id == "like"
    ) {
      cpBuffer = true;
      if (is_question == true && isPostUser == true) setIsAnswer(true);
      setUtilCounts([utilCounts[0] + 1, utilCounts[1], utilCounts[2]]);
    }
    if (
      currentPreference == null &&
      (e.target as HTMLButtonElement).id == "dislike"
    ) {
      cpBuffer = false;
      if (is_question == true && isPostUser == true) setIsAnswer(false);
      setUtilCounts([utilCounts[0], utilCounts[1] + 1, utilCounts[2]]);
    }
    setCurrentPreference(cpBuffer);
    if (debouncer) {
      clearTimeout(debouncer);
    }
    setDebouncer(
      setTimeout(async () => {
        if (cpBuffer != null) {
          await updateCommentPreference(
            current_user?.user_id,
            comment.comment_id,
            cpBuffer,
          );
        } else {
          await removeCommentPreference(
            current_user?.user_id,
            comment.comment_id,
          );
        }
        if (comment_render) comment_render((e) => !e);
      }, 2500),
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-base-300 p-4">
      <div className="flex items-center justify-between">
        <div className="profile flex gap-3  items-center">
          {user?.profile_image == "NO IMAGE" ? (
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="text-md">
                  {user.name.split(" ")[0][0].toUpperCase()}
                  {user.name.split(" ")[1][0].toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user?.profile_image} loading="lazy" />
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
                <h1 className="text-base">{user.name}</h1>
                <p className="text-xs break-all">{user.email}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col w-20">
          <button
            className="btn btn-sm btn-ghost flex gap-4 items-center"
            id="like"
            onClick={checkPreference}
          >
            <HiOutlineChevronUp
              className={
                `text-xl pointer-events-none` +
                (currentPreference == true ? ` text-green-500` : "")
              }
            />
            {utilCounts[0]}
          </button>
          <button
            className="btn btn-sm btn-ghost flex gap-4 items-center"
            id="dislike"
            onClick={checkPreference}
          >
            <HiOutlineChevronDown
              className={
                `text-xl pointer-events-none` +
                (currentPreference == false ? ` text-red-500` : "")
              }
            />
            {utilCounts[1]}
          </button>
        </div>
      </div>
      <div className="divider m-0">
        {isAnswer == true ? (
          <div className="badge badge-accent">Verified Answer</div>
        ) : null}
      </div>
      <div className="space-y-4">
        <p className="text-sm">{comment.message}</p>
        <p className="text-xs opacity-50">{comment.created_at}</p>
      </div>
    </div>
  );
};
export default CommentCard;
