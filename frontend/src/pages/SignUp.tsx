import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp =  () => {

  const [loading, setLoading] = useState<boolean>(false);
  const navigator = useNavigate();
  const [error, setError] = useState<String>();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const bio = useRef<HTMLTextAreaElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const address = useRef<HTMLTextAreaElement>(null);
  const profile_image = useRef<HTMLInputElement>(null);
  const appreciate_mode = useRef<HTMLInputElement>(null);

  const sign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    var image:string = "NO IMAGE";
    const file = (profile_image.current as HTMLInputElement).files?.[0];
    if (file) {
      data.append("upload_preset", "image_preset");
      data.append("file", file);
      data.append("folder", "profiles")
    }
    await axios.post(import.meta.env.VITE_CLOUDINARY_URL + "/image/upload", data).then((res) => {
      image = res.data.secure_url;
    })
    await axios.post(import.meta.env.VITE_BACKEND_URL + "/user/create", {
      name: name.current?.value,
      email: email.current?.value,
      password: password.current?.value,
      address: address.current?.value,
      profile_image: image,
      bio: bio.current?.value,
      phone: phone.current?.value,
      appreciate_mode: (appreciate_mode.current?.value == "on" ? "Likes" : "Upvotes")
    }).then((res) => {
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      setLoading(false);
      localStorage.setItem("auth-token", res.data.jwt);
      navigator("/user/feed")
    })
  }


  return <div className="h-screen grid place-items-center">
    {error ?
      <div className="toast">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
      : null
    }
    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-300">
      <form className="card-body" encType="multipart/form-data" onSubmit={sign}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" placeholder="email" ref={email} className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="password" placeholder="password" ref={password} className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Bio</span>
          </label>
          <textarea className="textarea textarea-bordered" ref={bio} placeholder="Bio"></textarea>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input type="text" placeholder="full name" ref={name} className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input type="number" placeholder="phone number" ref={phone} className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <textarea className="textarea textarea-bordered" ref={address} placeholder="address"></textarea>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Profile Image</span>
          </label>
          <input type="file" ref={profile_image} className="file-input-md file-input file-input-bordered w-full max-w-xs" />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Appreciate Type</span>
          </label>
          <div className="w-full flex justify-start items-center gap-3">
            Likes
            <input type="checkbox" ref={appreciate_mode} className="toggle" />
            Upvotes
          </div>
        </div>

        <div className="form-control mt-6">
          {
            loading ?
              <button className="btn btn-primary" disabled>
                <span className="loading loading-spinner loading-sm"></span>
              </button>
              :
              <button className="btn btn-primary">
                Sign Up
              </button>

          }
        </div>
      </form>
    </div>
  </div>
}
export default SignUp;
