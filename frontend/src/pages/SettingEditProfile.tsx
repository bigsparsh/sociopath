import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import CurrentUserType from "../types/CurrentUserType";
import { useNavigate } from "react-router-dom";

const SettingEditProfile = ({
  page,
}: {
  page: Dispatch<SetStateAction<string>>;
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | File>("NO IMAGE");
  const [profileFile, setProfileFile] = useState<File>();
  const navigator = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const password = useRef<HTMLInputElement>(null);
  const bio = useRef<HTMLTextAreaElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const address = useRef<HTMLTextAreaElement>(null);
  const appreciate_mode = useRef<HTMLInputElement>(null);

  useEffect(() => {
    page("Edit Profile");
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
        "/user/me?jwt=" +
        localStorage.getItem("auth-token"),
      )
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
          return;
        }
        bio.current!.value = res.data.you.bio;
        name.current!.value = res.data.you.name;
        phone.current!.value = res.data.you.phone;
        address.current!.value = res.data.you.address;
        setProfileImage(res.data.you.profile_image);
        appreciate_mode.current!.checked =
          res.data.you.appreciate_mode == "Likes" ? false : true;
        setCurrentUser(res.data.you);
      });
  }, []);

  const updateUserData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    let image: string = "NO IMAGE";
    const file = profileFile || "NO IMAGE";
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
      .put(
        import.meta.env.VITE_BACKEND_URL +
        "/user/update?filterId=" +
        currentUser?.user_id,
        {
          name: name.current?.value.trim(),
          password:
            password.current?.value.trim() == ""
              ? currentUser?.password
              : password.current?.value.trim(),
          address: address.current?.value.trim(),
          profile_image: image,
          bio: bio.current?.value.trim(),
          email: currentUser?.email,
          phone: phone.current?.value.trim(),
          appreciate_mode:
            appreciate_mode.current?.value == "on" ? "Likes" : "Upvotes",
        },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
          return;
        }
        setLoading(false);
        navigator("/user/feed");
      });
  };

  return (
    <div className="h-full my-3 lg:my-10 flex lg:flex-row gap-y-10 gap-x-3 flex-col justify-evenly items-center w-full px-10">
      {error ? (
        <div className="toast">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      ) : null}
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-300/70">
        <form
          className="card-body"
          encType="multipart/form-data"
          onSubmit={updateUserData}
        >
          <h1 className="text-2xl font-semibold text-center">
            Edit Profile form
            <span className="text-sm block font-normal mb-3">
              Change the information in form in order to edit your user profile
            </span>
          </h1>
          <div className="card-body flex flex-col gap-3">
            {!currentUser ? (
              <div className="rounded-xl h-40 aspect-video bg-base-200 skeleton"></div>
            ) : profileImage == "NO IMAGE" ? (
              <div className="rounded-xl h-40 aspect-video grid place-items-center bg-base-300">
                No Profile Image
              </div>
            ) : (
              <div
                className="rounded-xl h-40 aspect-video bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${profileImage})` }}
              ></div>
            )}
            <div className="form-control ">
              <label className="cursor-pointer label">
                <span className="label-text">Remove profile</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-info"
                  onChange={(e) =>
                    e.target.checked
                      ? setProfileImage("NO IMAGE")
                      : setProfileImage(
                        currentUser?.profile_image || "NO IMAGE",
                      )
                  }
                />
              </label>
            </div>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files == null || !e.target.files[0]) {
                  setProfileImage(currentUser?.profile_image || "NO IMAGE");
                  return;
                } else {
                  setProfileImage(URL.createObjectURL(e.target.files[0]));
                  setProfileFile(e.target.files[0]);
                }
              }}
              accept="image/*"
              className="file-input-sm placeholder:text-xs bg-base-100/50 backdrop-blur-sm file-input file-input-bordered w-full lg:max-w-xs"
            />
            <p className="text-xs text-center">
              Choose file only if you want to change the profile
            </p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="leave empty to keep same password"
              ref={password}
              className="input input-bordered bg-base-100/50 backdrop-blur-sm placeholder:text-xs"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              className="textarea textarea-bordered placeholder:text-xs bg-base-100/50 backdrop-blur-sm"
              ref={bio}
              placeholder="Bio"
              required
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="full name"
              ref={name}
              className="input input-bordered placeholder:text-xs bg-base-100/50 backdrop-blur-sm"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="number"
              placeholder="phone number"
              ref={phone}
              className="input input-bordered placeholder:text-xs bg-base-100/50 backdrop-blur-sm"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <textarea
              className="textarea textarea-bordered placeholder:text-xs bg-base-100/50 backdrop-blur-sm"
              ref={address}
              placeholder="address"
              required
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Appreciate Type</span>
            </label>
            <div className="w-full flex justify-center text-xs items-center gap-3">
              Likes
              <input type="checkbox" ref={appreciate_mode} className="toggle" />
              Upvotes
            </div>
          </div>

          <div className="form-control mt-6">
            {loading ? (
              <button className="btn btn-primary" disabled>
                <span className="loading loading-spinner loading-sm"></span>
              </button>
            ) : (
              <button className="btn btn-primary">Update my profile</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default SettingEditProfile;
