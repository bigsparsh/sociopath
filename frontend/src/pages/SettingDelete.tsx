import { Dispatch, SetStateAction, useEffect } from "react";

const SettingDelete = ({
  page,
}: {
  page: Dispatch<SetStateAction<string>>;
}) => {
  useEffect(() => {
    page("Delete Account");
  }, []);
  return <h1>This is delete setting</h1>;
};
export default SettingDelete;
