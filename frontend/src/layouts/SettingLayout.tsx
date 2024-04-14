import { useState } from "react";
import SettingEditProfile from "../pages/SettingEditProfile";
import SettingDelete from "../pages/SettingDelete";

const SettingLayout = () => {
  const [tabs, setTabs] = useState<string>("Edit Profile");
  return (
    <div className="flex flex-col justify-between items-center">
      <div className="p-3">
        <div role="tablist" className="tabs tabs-boxed">
          <a
            role="tab"
            className={tabs == "Edit Profile" ? "tab tab-active" : "tab"}
            onClick={() => setTabs("Edit Profile")}
          >
            Edit Profile
          </a>
          <a
            role="tab"
            className={tabs == "Preferences" ? "tab tab-active" : "tab"}
            onClick={() => setTabs("Preferences")}
          >
            Preferences
          </a>
          <a
            role="tab"
            className={tabs == "Delete Account" ? "tab tab-active" : "tab"}
            onClick={() => setTabs("Delete Account")}
          >
            Delete Account
          </a>
        </div>
      </div>
      <div className="grow p-5 w-full">
        {tabs == "Edit Profile" ? (
          <SettingEditProfile page={setTabs} />
        ) : tabs == "Preferences" ? (
          "This is preference"
        ) : tabs == "Delete Account" ? (
          <SettingDelete page={setTabs} />
        ) : null}
      </div>
    </div>
  );
};
export default SettingLayout;
