import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils";

const Timer = () => {
  const [time, setTime] = useState([0, 0]);
  const navigator = useNavigate();
  
  useEffect(() => {
    var timer = localStorage.getItem("screen-time") * 60;
    if (localStorage.getItem("screen-time")) {
      const interval = setInterval(() => {
        const minutes = parseInt(timer / 60 - 1);
        const seconds = parseInt(timer % 60);
        if (timer == 0) {
          clearInterval(interval);
          logout(navigator);
        }
        setTime([minutes, seconds]);
        timer--;
      }, 1000)
    }
  }, [])
  return <div>{
    localStorage.getItem("screen-time") ?
      <span className="countdown font-mono text-2xl">
        <span style={{ "--value": time[0] }}></span>m
        <span style={{ "--value": time[1] }}></span>s
      </span>
      : null
  }</div>
}
export default Timer; 
