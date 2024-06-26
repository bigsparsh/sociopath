import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import PostType from "../types/PostType";
import axios from "axios";
import CurrentUserType from "../types/CurrentUserType";
import FilterSettings from "../components/FilterSettings";
import { useParams, useSearchParams } from "react-router-dom";

const FeedSearch = () => {
  const [posts, setPosts] = useState<PostType[]>();
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [intake, setIntake] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { type } = useParams();
  const [options, setOptions] = useState<{
    type: string | undefined;
    param: URLSearchParams;
  } | null>(null);
  const [searchParam, _] = useSearchParams();
  useEffect(() => {
    setOptions({
      type: type,
      param: searchParam,
    });
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
        setLoading(false);
        if (res.data.error) return;
        setCurrentUser(res.data.you);
      });
  }, []);
  return (
    <div className="flex overflow-x-clip">
      <div className="flex flex-col grow w-full lg:basis-2/3 p-3 lg:p-10 gap-5">
        <div className="flex  justify-between items-center">
          <h1 className="text-2xl font-semibold mb-4">Your search results</h1>
          <button
            className="btn btn-sm btn-primary block lg:hidden"
            onClick={() =>
              (
                document.getElementById("my_modal_5") as HTMLDialogElement
              ).showModal()
            }
          >
            Filter options
          </button>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h1 className="text-xl font-semibold text-primary text-center mb-5">
                Select a filter option and fill out accurate detail
              </h1>
              <div className="flex flex-col gap-5 justify-center items-center">
                {options != null && (
                  <FilterSettings
                    set_posts={setPosts}
                    options={options}
                    current_user={currentUser}
                    set_intake={setIntake}
                    intake={intake}
                    posts={posts}
                    loading={setLoading}
                  />
                )}
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        {posts?.length == 0 && (
          <div className="h-[50vh] w-full grid place-items-center">
            <span className="loading loading-ball loading-lg"></span>
            <h1 className="text-lg italic ">
              Loading or your items were not found
            </h1>
          </div>
        )}
        {currentUser &&
          posts?.map((ele) => {
            let answered = false;
            ele.comment.map((ele) => {
              if (ele.is_answer == true) {
                answered = true;
              }
            });
            return (
              <PostCard
                post={{
                  is_answered: answered,
                  is_question: ele.is_question,
                  post_id: ele.post_id,
                  description: ele.description,
                  comment_enabled: ele.comment_enabled,
                  post_image: ele.post_image,
                  created_at: String(new Date(ele.created_at)),
                  preference: ele.preference,
                }}
                tags={ele.tag}
                right_sec={null}
                key={ele.post_id}
                user={ele.user}
                comment={ele.comment}
                current_user={currentUser}
                feed_render={null}
                overlay={null}
              />
            );
          })}
        {loading ? (
          <button className="btn btn-sm btn-primary" disabled>
            Load More
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setIntake((e) => e + 5)}
          >
            Load More
          </button>
        )}
      </div>
      <div className="lg:flex hidden flex-col gap-5 basis-1/3 z-20">
        <h1 className="mb-5">Search by</h1>
        {options != null && (
          <FilterSettings
            set_posts={setPosts}
            options={options}
            current_user={currentUser}
            set_intake={setIntake}
            intake={intake}
            posts={posts}
            loading={setLoading}
          />
        )}
      </div>
    </div>
  );
};
export default FeedSearch;
