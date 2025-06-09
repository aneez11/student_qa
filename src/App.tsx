import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Grade from "./pages/Grade/Grade";
import Chapter from "./pages/Grade/Chapter/Chapter";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grade/:gradeId" element={<Grade />} />
        <Route path="/grade/:gradeId/:chapterId" element={<Chapter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
