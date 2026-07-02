import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Grade from "./pages/Grade/Grade";
import Chapter from "./pages/Grade/Chapter/Chapter";
import Bookmarks from "./pages/Bookmarks/Bookmarks";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/grade/:gradeId" element={<Grade />} />
          <Route path="/grade/:gradeId/:chapterId" element={<Chapter />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
