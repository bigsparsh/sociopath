import axios from "axios";
import PostType from "../types/PostType";
import CurrentUserType from "../types/CurrentUserType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const FilterSettings = ({
  set_posts,
  current_user,
  set_intake,
  intake,
  posts,
  loading,
}: {
  set_posts: Dispatch<SetStateAction<PostType[] | undefined>>;
  current_user: CurrentUserType | undefined;
  set_intake: Dispatch<SetStateAction<number>>;
  intake: number;
  posts: PostType[] | undefined;
  loading: Dispatch<SetStateAction<boolean>>;
}) => {
  const [filterMode, setFilterMode] = useState<string>("Normal");
  const [link, setLink] = useState<string>();
  const [body, setBody] = useState<object>();
  useEffect(() => {
    if (link && body) {
      axios
        .post(import.meta.env.VITE_BACKEND_URL + link + intake, body, {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        })
        .then((res) => {
          console.log(res.data.psots);
          if (res.data.error) return;
          if (intake == 0) {
            loading(false);
            set_posts(res.data.posts);
            return;
          }
          const newPosts = [...(posts ?? []), ...res.data.posts];
          set_posts(newPosts);
          loading(false);
        });
    }
  }, [intake, body]);

  let myTimeout: ReturnType<typeof setTimeout>;
  const changeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(myTimeout);
    myTimeout = setTimeout(() => {
      set_posts([]);
      setBody({
        userName: e.target.value,
      });
    }, 500);
  };

  const changeTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(myTimeout);
    myTimeout = setTimeout(() => {
      set_posts([]);
      const tgs = e.target.value.split(",").map((ele) => ele.trim());
      setBody({
        tags: tgs,
      });
    }, 500);
  };

  return (
    <>
      <div className="join">
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="Appreciation"
          onChange={() => {
            setBody({ appreciationType: true });
            setFilterMode("Appreciation");
            setLink("/post/search?searchParam=Appreciation&intake=");
            set_intake(0);
          }}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="User"
          onChange={() => {
            setFilterMode("User");
            setLink("/post/search?searchParam=User&intake=");
            set_intake(0);
          }}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="Tags"
          onChange={() => {
            setFilterMode("Tags");
            setLink("/post/search?searchParam=Tags&intake=");
            set_intake(0);
          }}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="Friends"
          onChange={() => {
            setFilterMode("Friends");
            setBody({
              currentUserId: current_user?.user_id,
            });
            setLink("/post/search?searchParam=Friends&intake=");
            set_intake(0);
          }}
        />
      </div>
      <div className="flex flex-col">
        {filterMode == "User" ? (
          <input
            type="text"
            onChange={changeUserName}
            placeholder="Enter the name of the user"
            className="input input-bordered w-full max-w-xs"
          />
        ) : filterMode == "Tags" ? (
          <input
            type="text"
            onChange={changeTags}
            placeholder="Specify tags seperated by commas"
            className="input input-bordered w-full max-w-xs"
          />
        ) : filterMode == "Appreciation" ? (
          <div className="flex justify-center gap-4">
            Like{" "}
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) => {
                console.log(e.target.checked);
                e.target.checked
                  ? setBody({ appreciationType: false })
                  : setBody({ appreciationType: true });
                set_intake(0);
              }}
            />{" "}
            Dislike
          </div>
        ) : null}
      </div>
    </>
  );
};
export default FilterSettings;
