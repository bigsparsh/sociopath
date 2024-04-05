import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import PostType from "../types/PostType";
import axios from "axios";
import CurrentUserType from "../types/CurrentUserType";
import FilterSettings from "../components/FilterSettings";

const FeedSearch = () => {
  const [posts, setPosts] = useState<PostType[]>();
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [intake, setIntake] = useState<number>(0);
  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
        "/user/me?jwt=" +
        localStorage.getItem("auth-token"),
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
      .then((res) => {
        if (res.data.error) return;
        setCurrentUser(res.data.you);
      });
  }, []);
  return (
    <div className="flex">
      <div className="flex flex-col basis-2/3 p-10 gap-5">
        {currentUser &&
          posts?.map((ele) => {
            return (
              <PostCard
                current_user={currentUser}
                user={ele.user}
                tags={ele.tag}
                post={{
                  post_id: ele.post_id,
                  created_at: ele.created_at,
                  post_image: ele.post_image,
                  comment_enabled: ele.comment_enabled,
                  description: ele.description,
                  preference: ele.preference,
                }}
                right_sec={null}
                comment={ele.comment}
                feed_render={null}
                overlay={null}
              />
            );
          })}
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setIntake((e) => e + 5)}
        >
          Load More
        </button>
      </div>
      <div className="flex flex-col gap-5 basis-1/3 z-30">
        <FilterSettings
          set_posts={setPosts}
          current_user={currentUser}
          set_intake={setIntake}
          intake={intake}
          posts={posts}
        />
      </div>
    </div>
  );
};
export default FeedSearch;
