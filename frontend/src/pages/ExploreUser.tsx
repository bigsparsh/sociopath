import { useEffect, useState } from "react";
import UserType from "../types/UserType";
import axios from "axios";
import UserCard from "../components/UserCard";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const ExploreUser = () => {
  const [users, setUsers] = useState<UserType[]>();
  const [userIntake, setUserIntake] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [link, setLink] = useState<string>("/user/get?intake=");
  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + link + userIntake, {
        headers: {
          Authorization: localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        if (res.data.error) return;
        if (userIntake == 0) {
          setLoading(false);
          setUsers(res.data.users);
          return;
        }
        const newUsers = [...(users ?? []), ...res.data.users];
        setUsers(newUsers);
        setLoading(false);
      });
  }, [userIntake, link]);

  let myTimeout: ReturnType<typeof setTimeout>;
  const fetchSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(myTimeout);
    myTimeout = setTimeout(() => {
      if (e.target.value == "") setLink("/user/get?intake=");
      else setLink("/user/search?filter=" + e.target.value + "&intake=");
      setUserIntake(0);
    }, 250);
  };
  return (
    <div className="lg:p-10 p-3 w-full lg:w-2/3">
      <label className="input mb-5 input-bordered flex items-center gap-2">
        <input
          type="text"
          onChange={fetchSearch}
          className="grow"
          placeholder="Search for users"
        />
        <HiMiniMagnifyingGlass />
      </label>
      <div className="flex flex-col gap-4">
        {users?.map((ele) => <UserCard user={ele} key={ele.user_id} />)}
        {loading ? (
          <button className="btn">
            <span className="loading loading-spinner"></span>
            loading
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setUserIntake((e) => e + 5);
            }}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};
export default ExploreUser;
