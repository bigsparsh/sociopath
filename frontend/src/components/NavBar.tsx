import { useEffect, useState } from "react";
import logo from "../assets/social-lilac.svg"
import Timer from "./Timer";
const NavBar = ({ extras }) => {
  


  return <div className="navbar bg-base-100 justify-between">
    <div className="">
      <a className="btn btn-ghost text-xl">
        <img src={logo} width="75" className="hidden lg:block" />
        {extras ? extras : null}

      </a>
    </div>
   <Timer /> 
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">

        <li><a>Link</a></li>
        <li>
          <details>
            <summary>
              Parent
            </summary>
            <ul className="p-2 bg-base-100 rounded-t-none z-10">
              <li><a>Link 1</a></li>
              <li><a>Link 2</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
}

export default NavBar;
