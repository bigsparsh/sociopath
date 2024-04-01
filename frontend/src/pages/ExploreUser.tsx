import { useEffect, useState } from "react";
import UserType from "../types/UserType";
import axios from "axios";
import UserCard from "../components/UserCard";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const ExploreUser = () => {
  const [users, setUsers] = useState<UserType[]>();
  const [userIntake, setUserIntake] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL + "/user/get?intake=" + userIntake,
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        },
      )
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
  }, [userIntake]);
  return (
    <div className="lg:p-10 p-3 w-full lg:w-2/3">
      <label className="input mb-5 input-bordered flex items-center gap-2">
        <input type="text" className="grow" placeholder="Search for users" />
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
