import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css"
import Landing from "./pages/Landing";
import LandingLayout from "./layouts/LandingLayout";
import Feed from "./pages/Feed";
import PrimaryLayout from "./layouts/PrimaryLayout";
const App = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<Landing />} />
      </Route>
      <Route path="/user" element={<PrimaryLayout />} >
        <Route path="feed">
          <Route index element={<Feed />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App;
