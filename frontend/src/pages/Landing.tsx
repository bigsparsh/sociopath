import React, { useRef, useState } from "react"
import logo from "../assets/social-lilac.svg"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi2";
const Landing = () => {

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [timer, setTimer] = useState<boolean>(false);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const screenTime = useRef<HTMLInputElement>(null);
  const navigator = useNavigate();

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(val => !val);
    axios.post(import.meta.env.VITE_BACKEND_URL + "/user/login", {
      email: (email.current as HTMLInputElement).value,
      password: (password.current as HTMLInputElement).value
    }).then((res) => {
      if (res.data.error) {
        setError(res.data.error);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        localStorage.setItem("auth-token", res.data.jwt);
        if(screenTime.current) {
            localStorage.setItem("screen-time", screenTime.current.value);
          }
        navigator("/user/feed");
      }
      setLoadingState(val => !val);
    });

  }

  return (
    <>
      {
        error ?
          <div className="toast z-20">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          </div> : null
      }
      <div className="hero min-h-screen bg-base-200 bg-blend-overlay" style={{ backgroundImage: 'url(//picsum.photos/id/294/1920/1080)' }}>
        <div className="hero-content flex-col gap-10 lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Explore seamless interaction</h1>
            <p className="py-6"> Socialilac represents a clean and refined interface to interact with your loved ones, presenting various important features that help with the process.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={login}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" ref={email} placeholder="email" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" ref={password} placeholder="password" className="input input-bordered" required />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="toggle toggle-primary toggle-sm" onChange={() => {
                    setTimer(e => !e);
                  }} />

                  <label className="label">
                    <span className="label-text">Screen logout timer</span>
                  </label>
                </div>
                <label className="label">
                  <div className="tooltip" data-tip="Enabling this will add a timer when you login and when the time runs out you will be logged out.">
                    <button className="btn btn-sm btn-ghost">
                      <HiOutlineInformationCircle className="text-lg" />
                    </button>
                  </div>
                </label>
              </div>
              {
                timer ?
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Minutes</span>
                    </label>
                    <input type="range" min="1" max="5"  className="range range-primary range-sm" ref={screenTime} />
                    <div className="w-full flex justify-between text-xs px-2">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div> : null
              }
              <div className="form-control mt-6">
                {!loadingState ?
                  <button className="btn btn-primary">
                    Login
                  </button> :
                  <button className="btn btn-primary" disabled>
                    <span className="loading loading-spinner loading-xs"></span> Login
                  </button>}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="p-10 grid place-items-center">
        <div className="card lg:card-side bg-base-100 shadow-xl w-fit">
          <figure><img src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg" alt="Album" /></figure>
          <div className="card-body">
            <h2 className="card-title">Enjoy the experience now!</h2>
            <p>Click the button to Sign up now and explore the world of Socialilac</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer p-10 bg-base-200 text-base-content">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
        <aside className="items-center grid-flow-col">
          <img src={logo} width="100" />
          <p>Socialilac Ltd. <br />Providing reliable tech since 1992</p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
          </div>
        </nav>
      </footer>
    </>

  )

}
export default Landing;
