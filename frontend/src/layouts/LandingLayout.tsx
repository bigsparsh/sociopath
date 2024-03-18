import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const LandingLayout = () => {
  return <div className=" flex flex-col">
    <NavBar extras={null} />
    <Outlet />
  </div>
}

export default LandingLayout;
