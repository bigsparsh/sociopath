import { useEffect, useState } from "react";
import {
  HiChatBubbleLeft,
  HiMiniHandThumbDown,
  HiMiniHandThumbUp,
} from "react-icons/hi2";
import CurrentUserType from "../types/CurrentUserType";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadPost = () => {
  const [description, setDescription] = useState<string>("");
  const [postImage, setPostImage] = useState<string | File>("NO IMAGE");
  const [postFile, setPostFile] = useState<File>();
  const [enableComment, setEnableComment] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [tags, setTags] = useState<string[]>();
  const navigator = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
        "/user/me?jwt=" +
        localStorage.getItem("auth-token"),
      )
      .then((res) => {
        if (res.data.error) return;
        setCurrentUser(res.data.you);
        setLoading(false);
      });
  }, []);

  const uploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    var image: string = "NO IMAGE";
    const file = postFile || "NO IMAGE";
    data.append("upload_preset", "image_preset");
    data.append("file", file);
    data.append("folder", "post");
    await axios
      .post(import.meta.env.VITE_CLOUDINARY_URL + "/image/upload", data)
      .then((res) => {
        image = res.data.secure_url;
      })
      .catch(() => {
        image = "NO IMAGE";
      });
    await axios
      .post(
        import.meta.env.VITE_BACKEND_URL + "/post/create",
        {
          description: description,
          post_image: image,
          user_id: currentUser?.user_id,
          tag: tags,
        },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
      .then(() => {
        setLoading(false);
        navigator("/user/feed");
      });
  };
  return (
    <div className="flex justify-evenly gap-5 flex-col lg:flex-row items-center p-4 lg:p-10 h-full overflow-x-clip">
      <div className="fixed text-transparent lg:inset-y-20 lg:inset-x-[20%] w-fit h-fit flex-col flex justify-center items-center text-7xl lg:text-9xl font-black tracking-wide ">
        <h1 className="bg-gradient-to-r from-primary/50 via-primary to-primary/50 bg-clip-text">
          UPLOAD
        </h1>
        <h1 className="bg-gradient-to-l from-primary/50 via-primary to-primary/50 bg-clip-text">
          POST
        </h1>
      </div>

      <div className="lg:basis-1/3 w-full">
        <div className="card shrink-0 w-full lg:max-w-sm shadow-2xl bg-base-300/70 lg:bg-base-300">
          <form
            className="card-body"
            encType="multipart/form-data"
            onSubmit={uploadPost}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered placeholder:text-xs bg-base-100/50 backdrop-blur-sm"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="description"
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Post Image (Optional)</span>
              </label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files == null || !e.target.files[0]) {
                    setPostImage("NO IMAGE");
                    return;
                  } else {
                    setPostImage(URL.createObjectURL(e.target.files[0]));
                    setPostFile(e.target.files[0]);
                  }
                }}
                accept="image/*"
                className="file-input-sm placeholder:text-xs bg-base-100/50 backdrop-blur-sm file-input file-input-bordered w-full lg:max-w-xs"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Tags (Use commas to seperate) (Optional)
                </span>
              </label>
              <input
                type="tags"
                placeholder="tags eg: adventure,playful,new"
                className="input input-bordered bg-base-100/50 backdrop-blur-sm placeholder:text-xs"
                onChange={(e) => setTags(e.target.value.split(","))}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enable Comment</span>
              </label>
              <div className="w-full flex justify-start text-xs items-center gap-3">
                <input
                  type="checkbox"
                  onChange={() => {
                    setEnableComment((e) => !e);
                  }}
                  className="toggle"
                />
              </div>
            </div>

            <div className="form-control mt-6">
              {loading ? (
                <button className="btn btn-primary" disabled>
                  <span className="loading loading-spinner loading-sm"></span>
                </button>
              ) : (
                <button className="btn btn-primary">Upload post</button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="lg:basis-2/3 w-full">
        <div
          className={
            postImage == "NO IMAGE"
              ? `flex x-20 border border-base-100 flex-col opacity-90 bg-base-300 rounded-xl shadow-xl max-h-[600px] z-50`
              : `flex flex-col bg-base-300 border border-base-100 rounded-xl shadow-xl relative h-[600px] z-10`
          }
        >
          {postImage == "NO IMAGE" ? null : (
            <div
              className="bg-cover bg-center grow absolute inset-0 scale-110 blur-3xl opacity-30 z-[-10]"
              style={{ backgroundImage: `url(${postImage})` }}
            ></div>
          )}

          <div className="p-5 flex justify-between items-center bg-base-300 rounded-t-xl">
            <div className="profile flex gap-5 items-center">
              {loading ? (
                <div className="avatar skeleton">
                  <div className="w-12 rounded-full"></div>
                </div>
              ) : currentUser?.profile_image == "NO IMAGE" ? (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-lg">
                      {currentUser.name.split(" ")[0][0].toUpperCase()}
                      {currentUser.name.split(" ")[1][0].toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={currentUser?.profile_image} loading="lazy" />
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                {!currentUser ? (
                  <>
                    <div className="w-52 rounded-full h-3 skeleton"></div>
                    <div className="w-24 rounded-full h-3 skeleton"></div>
                  </>
                ) : (
                  <>
                    <h1 className="text-xl">{currentUser.name}</h1>
                    <p className="text-sm">{currentUser.email}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {postImage == "NO IMAGE" ? null : (
            <div
              className="bg-cover bg-center grow opacity-80"
              style={{ backgroundImage: `url(${postImage})` }}
            ></div>
          )}
          <div className="text-cont max-h-[200px] overflow-auto bg-base-300">
            <p className="p-5">{description}</p>
          </div>
          <p className="text-xs  px-5 pt-3 bg-base-300">
            Posted at {String(new Date())}{" "}
          </p>
          <div className="flex bg-base-300 p-5 justify-start lg:gap-16 items-center rounded-b-xl">
            <button className="btn btn-ghost flex gap-3 items-center" id="like">
              <HiMiniHandThumbUp className={`text-xl pointer-events-none`} /> 53
            </button>
            <button
              className="btn btn-ghost flex gap-3 items-center"
              id="dislike"
            >
              <HiMiniHandThumbDown className={`text-xl pointer-events-none`} />{" "}
              64
            </button>
            {enableComment ? (
              <button className="btn btn-ghost flex gap-3 items-center">
                <HiChatBubbleLeft className="text-xl" /> 34
              </button>
            ) : (
              <button
                className="btn btn-ghost flex gap-3 items-center"
                disabled
              >
                <HiChatBubbleLeft className="text-xl" /> 34
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadPost;
