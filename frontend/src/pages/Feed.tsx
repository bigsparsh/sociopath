import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CurrentUserType from "../types/CurrentUserType"
import PostType from "../types/PostType"

const Feed = () => {

  const [posts, setPosts] = useState<PostType[]>();
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [feedRender, setFeedRender] = useState<boolean>(false);
  const [rightSection, setRightSection] = useState<JSX.Element | null | undefined>();
  const n = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      n("/");
    }
    else {
      axios.get(import.meta.env.VITE_BACKEND_URL + "/user/me?jwt=" + localStorage.getItem("auth-token"), {
        headers: {
          Authorization: localStorage.getItem("auth-token")
        }
      }).then((res) => {
        if (res.data.error) return;
        setCurrentUser(res.data.you);
      })

      axios.get(import.meta.env.VITE_BACKEND_URL + "/post/get", {
        headers: {
          Authorization: localStorage.getItem("auth-token")
        }
      }).then((res) => {
        if (res.data.error) return;
        setPosts(res.data.posts);
      })
    }
  }, [feedRender, n])

  return <div className="flex ">
    <div className="p-3 lg:p-10 grow lg:basis-2/3 w-full">
      <h1 className="text-3xl font-bold">Your Feed</h1>
      <div className="flex flex-col py-10 gap-5">
        {posts && currentUser ?
          posts.map((ele) => (
            <PostCard
              post={{
                post_id: ele.post_id,
                description: ele.description,
                post_image: ele.post_image,
                created_at: String(new Date(ele.created_at)),
                preference: ele.preference
              }}
              right_sec={setRightSection}
              key={ele.post_id}
              user={ele.user}
              comment={ele.comment}
              current_user={currentUser}
              feed_render={setFeedRender}
            />))
          :
          <div className="h-[500px] w-full grid place-items-center">
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        }
      </div>

    </div>
    <div className="lg:basis-1/2 basis-0">
      {
        rightSection ? rightSection : null
      }
    </div>
  </div>
}
export default Feed;
