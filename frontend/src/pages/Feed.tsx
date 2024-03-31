import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CurrentUserType from "../types/CurrentUserType";
import PostType from "../types/PostType";
import ImagePopup from "../components/ImagePopup";

const Feed = () => {
  const [posts, setPosts] = useState<PostType[]>();
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [feedRender, setFeedRender] = useState<boolean>(false);
  const [rightSection, setRightSection] = useState<
    JSX.Element | null | undefined
  >();
  const [pageIntake, setPageIntake] = useState<number>(0);
  const [overlay, setOverlay] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>();
  const n = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      n("/");
    } else {
      setLoading(true);
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

      axios
        .get(
          import.meta.env.VITE_BACKEND_URL + "/post/get?intake=" + pageIntake,
          {
            headers: {
              Authorization: localStorage.getItem("auth-token"),
            },
          },
        )
        .then((res) => {
          if (res.data.error) return;
          if (pageIntake == 0) {
            setLoading(false);
            setPosts(res.data.posts);
            return;
          }
          const newPosts = [...(posts ?? []), ...res.data.posts];
          setPosts(newPosts);
          setLoading(false);
        });
    }
  }, [n, pageIntake, feedRender]);

  return (
    <div className="flex overflow-x-clip">
      {overlay ? <ImagePopup image={overlay} overlay={setOverlay} /> : null}
      <div className="lg:flex fixed text-transparent lg:inset-y-10 lg:inset-x-5 hidden w-fit h-fit flex-col justify-center items-center text-7xl lg:text-9xl font-black tracking-wide ">
        <h1 className="bg-gradient-to-r from-primary/50 via-primary to-primary/50 bg-clip-text">
          YOUR
        </h1>
        <h1 className="bg-gradient-to-l from-primary/50 via-primary to-primary/50 bg-clip-text">
          FEED
        </h1>
      </div>

      <div className="p-3 lg:p-10 grow lg:basis-2/3 w-full">
        <h1 className="text-3xl font-bold block lg:hidden">Your Feed</h1>
        <div className="flex flex-col py-10 gap-5">
          {posts && currentUser ? (
            posts.map((ele) => (
              <PostCard
                post={{
                  post_id: ele.post_id,
                  description: ele.description,
                  comment_enabled: ele.comment_enabled,
                  post_image: ele.post_image,
                  created_at: String(new Date(ele.created_at)),
                  preference: ele.preference,
                }}
                tags={ele.tag}
                right_sec={setRightSection}
                key={ele.post_id}
                user={ele.user}
                comment={ele.comment}
                current_user={currentUser}
                feed_render={setFeedRender}
                overlay={setOverlay}
              />
            ))
          ) : (
            <div className="h-[500px] w-full grid place-items-center">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          )}
        </div>
        {!loading ? (
          <button
            className="btn btn-info"
            onClick={() => setPageIntake((e) => e + 5)}
          >
            Load More
          </button>
        ) : (
          <button className="btn btn-info">
            <span className="loading loading-spinner"></span>
            loading
          </button>
        )}
      </div>
      <div className="lg:basis-1/2 basis-0">
        {rightSection ? rightSection : null}
      </div>
    </div>
  );
};
export default Feed;
