import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils";

const Timer = () => {
  const [time, setTime] = useState<number[]>([0, 0]);
  const navigator = useNavigate();

  useEffect(() => {
    const screenTime = localStorage.getItem("screen-time");
    let timer = screenTime ? parseInt(screenTime) * 60 : 0;
    if (screenTime && timer) {
      const interval = setInterval(() => {
        const minutes = parseInt((timer / 60).toString(), 10);
        const seconds = parseInt((timer % 60).toString(), 10);
        if (timer == 0) {
          clearInterval(interval);
          logout(navigator);
        }
        setTime([minutes, seconds]);
        timer--;
      }, 1000)
    }
  }, [navigator])
  return <div>{
    localStorage.getItem("screen-time") ?
      <span className="countdown font-mono text-2xl">
        {/*@ts-expect-error Don't Worry it's fine*/}
        <span style={{ "--value": time[0] }}></span>m
        {/*@ts-expect-error Don't Worry it's fine*/}
        <span style={{ "--value": time[1] }}></span>s
      </span>
      : null
  }</div>
}
export default Timer; 
