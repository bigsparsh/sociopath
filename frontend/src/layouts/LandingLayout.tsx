import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const LandingLayout = () => {
  return <div className="overflow-x-hidden flex flex-col">
    <NavBar extras={null} />
    <Outlet />
  </div>
}

export default LandingLayout;
