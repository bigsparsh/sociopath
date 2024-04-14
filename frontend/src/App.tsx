import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing";
import LandingLayout from "./layouts/LandingLayout";
import Feed from "./pages/Feed";
import PrimaryLayout from "./layouts/PrimaryLayout";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import UploadPost from "./pages/UploadPost";
import ExploreUser from "./pages/ExploreUser";
import FeedSearch from "./pages/FeedSearch";
import SettingEditProfile from "./pages/SettingEditProfile";
import SettingLayout from "./layouts/SettingLayout";
import SettingDelete from "./pages/SettingDelete";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Landing />} />
        </Route>
        <Route path="/explore" element={<PrimaryLayout />}>
          <Route path="user" element={<ExploreUser />} />
        </Route>
        <Route path="/auth" element={<LandingLayout />}>
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route path="/user" element={<PrimaryLayout />}>
          <Route path="profile/:id" element={<UserProfile />} />
          <Route path="feed">
            <Route index element={<Feed />} />
            <Route path="create" element={<UploadPost />} />
            <Route path="search/:type" element={<FeedSearch />} />
          </Route>
        </Route>
        <Route path="/setting" element={<PrimaryLayout />}>
          <Route index element={<SettingLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
