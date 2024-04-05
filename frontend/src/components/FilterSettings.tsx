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
}: {
  set_posts: Dispatch<SetStateAction<PostType[] | undefined>>;
  current_user: CurrentUserType | undefined;
  set_intake: Dispatch<SetStateAction<number>>;
  intake: number;
  posts: PostType[] | undefined;
}) => {
  const [filterMode, setFilterMode] = useState<string | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [buffer, setBuffer] = useState<string>();
  const [appreciationType, setAppreciationType] = useState<boolean>(true);
  useEffect(() => {
    if (filterMode == "User" && userName) {
      if (buffer != filterMode) {
        set_intake(0);
        setBuffer(filterMode);
      }
      axios
        .post(
          import.meta.env.VITE_BACKEND_URL +
          "/post/search?intake=" +
          intake +
          "?searchParam=User",
          {
            userName: userName,
          },
          {
            headers: {
              Authorization: localStorage.getItem("auth-token"),
            },
          },
        )
        .then((res) => {
          if (res.data.error) return;
          if (intake == 0) {
            set_posts(res.data.posts);
            return;
          }
          const newPosts = [...(posts ?? []), ...res.data.posts];
          set_posts(newPosts);
        });
    } else if (filterMode == "Tags" && tags) {
      if (buffer != filterMode) {
        set_intake(0);
        setBuffer(filterMode);
      }
      axios
        .post(
          import.meta.env.VITE_BACKEND_URL +
          "/post/search?intake=" +
          intake +
          "&searchParam=Tags",
          {
            tags: tags,
          },
          {
            headers: {
              Authorization: localStorage.getItem("auth-token"),
            },
          },
        )
        .then((res) => {
          if (res.data.error) return;
          if (intake == 0) {
            set_posts(res.data.posts);
            return;
          }
          const newPosts = [...(posts ?? []), ...res.data.posts];
          set_posts(newPosts);
        });
    } else if (filterMode == "Friends") {
      if (buffer != filterMode) {
        set_intake(0);
        setBuffer(filterMode);
      }
      axios
        .post(
          import.meta.env.VITE_BACKEND_URL +
          "/post/search?intake=" +
          intake +
          "&searchParam=Friends",
          {
            currentUserId: current_user?.user_id,
          },
          {
            headers: {
              Authorization: localStorage.getItem("auth-token"),
            },
          },
        )
        .then((res) => {
          if (res.data.error) return;
          if (intake == 0) {
            set_posts(res.data.posts);
            return;
          }
          const newPosts = [...(posts ?? []), ...res.data.posts];
          set_posts(newPosts);
        });
    } else if (filterMode == "Appreciation") {
      if (buffer != filterMode) {
        set_intake(0);
        setBuffer(filterMode);
      }
      axios
        .post(
          import.meta.env.VITE_BACKEND_URL +
          "/post/search?intake=" +
          intake +
          "&searchParam=Appreciation",
          { appreciationType: appreciationType },
          {
            headers: {
              Authorization: localStorage.getItem("auth-token"),
            },
          },
        )
        .then((res) => {
          if (res.data.error) return;
          if (intake == 0) {
            set_posts(res.data.posts);
            return;
          }
          const newPosts = [...(posts ?? []), ...res.data.posts];
          set_posts(newPosts);
        });
    } else if (filterMode == null) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/post/get?intake=" + intake, {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        })
        .then((res) => {
          if (res.data.error) return;
          if (intake == 0) {
            set_posts(res.data.posts);
            return;
          }
          const newPosts = [...(posts ?? []), ...res.data.posts];
          set_posts(newPosts);
        });
    }
  }, [filterMode, userName, tags, intake, appreciationType]);

  let myTimeout: ReturnType<typeof setTimeout>;
  const changeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(myTimeout);
    myTimeout = setTimeout(() => {
      setUserName(e.target.value);
    }, 250);
  };

  const changeTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(myTimeout);
    myTimeout = setTimeout(() => {
      const tgs = e.target.value.split(",").map((ele) => ele.trim());
      setTags(tgs);
    }, 250);
  };

  return (
    <>
      <h1 className="mb-5">Search by</h1>
      <div className="join">
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="Appreciation"
          onChange={() => setFilterMode("Appreciation")}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="User"
          onChange={() => setFilterMode("User")}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="Tags"
          onChange={() => setFilterMode("Tags")}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          aria-label="Friends"
          onChange={() => setFilterMode("Friends")}
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
              onChange={() => setAppreciationType((e) => !e)}
            />{" "}
            Dislike
          </div>
        ) : null}
      </div>
    </>
  );
};
export default FilterSettings;
