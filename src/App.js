import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import StartPage from "./pages/StartPage/StartPage";
import MainPage from "./pages/MainPage/MainPage";
import DetailPage from "./pages/DetailPage/DetailPage";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import CheckTaste from "./pages/CheckTaste/CheckTaste";
import CheckNote from "./pages/CheckNote/CheckNote";
import MyPage from "./pages/MyPage/MyPage";
import MyPageEdit from "./pages/MyPageEdit/MyPageEdit";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";
import MyPageProfileEdit from "./pages/MyPageProfileEdit/MyPageProfileEdit";
import Withdrawal from "./pages/Withdrawal/Withdrawal";
import WriteDetailPage from "./pages/WriteDetailPage/WriteDetailPage";
import WriteNote from "./pages/WriteNote/WriteNote";
import SendNote from "./pages/SendNote/SendNote";
import LoginHandler from "./pages/LoginHandler/LoginHandler";

const App = () => {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    // 기존에는 의존성 배열이 없어 매 렌더마다 실행되면서도, 정작 화면 크기가
    // 바뀔 때(주소창 노출/회전)는 갱신되지 않았다.
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
    window.addEventListener("orientationchange", setScreenSize);
    return () => {
      window.removeEventListener("resize", setScreenSize);
      window.removeEventListener("orientationchange", setScreenSize);
    };
  }, []);

  return (
    <div className="WebAppFrame">
      <div className="Frame">
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<StartPage />} />
            <Route path="/MainPage" element={<MainPage />}></Route>
            <Route path="/DetailPage/:groupName/:groupColor/:group_id" element={<DetailPage />} />
            <Route path="/LoadingPage" element={<LoadingPage />}></Route>
            <Route path="/CheckTaste" element={<CheckTaste />}></Route>
            <Route path="/CheckNote" element={<CheckNote />}></Route>
            <Route path="/MyPage" element={<MyPage />}></Route>
            <Route path="/MyPageEdit" element={<MyPageEdit />}></Route>
            <Route path="/ProfileEdit" element={<ProfileEdit />}></Route>
            <Route path="/MyPageProfileEdit" element={<MyPageProfileEdit />}></Route>
            <Route path="/Withdrawal" element={<Withdrawal />}></Route>
            <Route path="/WriteDetailPage/:token" element={<WriteDetailPage />}></Route>
            <Route path="/WriteNote" element={<WriteNote />}></Route>
            <Route path="/SendNote" element={<SendNote />}></Route>
            <Route path="/LoginHandler" element={<LoginHandler />} /> 
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
