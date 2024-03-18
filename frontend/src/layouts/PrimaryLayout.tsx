import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { HiHome } from "react-icons/hi";
import { HiOutlineHome, HiMiniPhoto, HiBars3 } from "react-icons/hi2";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import logo from "../assets/social-lilac.svg"

const PrimaryLayout = () => {
  return <div className="flex flex-col">
    <NavBar extras={<label htmlFor="my-drawer-2" className="btn btn-sm btn-primary drawer-button lg:hidden"><HiBars3 className="text-xl"/></label>
    } />
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Outlet />


      </div>
      <div className="drawer-side">

        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <img src={logo} width="75" className="lg:hidden block" />
          <ul className="menu bg-base-200 w-56 rounded-box">
            <li>
              <a>
                <HiHome className="text-xl" />
                Home
              </a>
            </li>
            <li>
              <a>
                <HiOutlineHome className="text-xl" />
                Another Home
              </a>
            </li>
            <li>
              <a>
                <HiOutlineGlobeAlt className="text-xl" />
                Explore your network
              </a>
            </li>
            <li>
              <a>
                <HiMiniPhoto className="text-xl" />
                Your Feed
              </a>
            </li>
          </ul>
        </ul>

      </div>
    </div>

  </div>
}

export default PrimaryLayout;
