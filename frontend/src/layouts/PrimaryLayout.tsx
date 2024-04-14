import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  HiBars3,
  HiArrowUpTray,
  HiMiniPhoto,
  HiGlobeAsiaAustralia,
  HiMiniMagnifyingGlass,
} from "react-icons/hi2";
import logo from "../assets/social-lilac.svg";

const PrimaryLayout = () => {
  const navigator = useNavigate();
  return (
    <div className="flex flex-col ">
      <NavBar
        user={true}
        extras={
          <label
            htmlFor="my-drawer-2"
            className="btn btn-sm btn-primary drawer-button lg:hidden"
          >
            <HiBars3 className="text-xl" />
          </label>
        }
      />
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Outlet />
        </div>
        <div className="drawer-side z-30 rounded-r-xl">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 bg-base-300/80 rounded-r-xl min-h-full text-base-content">
            <img src={logo} width="75" className="lg:hidden block" />
            <ul className="menu font-bold w-full gap-1 rounded-box">
              <li>
                <a onClick={() => navigator("/user/feed/create")}>
                  <HiArrowUpTray className="text-xl" />
                  Upload
                </a>
              </li>
              <li>
                <a onClick={() => navigator("/user/feed")}>
                  <HiMiniPhoto className="text-xl" />
                  Your Feed
                </a>
              </li>
              <li>
                <a onClick={() => navigator("/explore/user")}>
                  <HiGlobeAsiaAustralia className="text-xl" />
                  Explore
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigator("/user/feed/search/normal");
                  }}
                >
                  <HiMiniMagnifyingGlass className="text-xl" />
                  Filter Feed
                </a>
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrimaryLayout;
