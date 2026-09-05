import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./SendNote.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import ShareButton from "../../images/SendNote/ShareButton.svg";

const SendNote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;
  const groupName = location.state?.groupName;

  const navigateToStartPage = () => {
    navigate("/");
  };

  const navigateToWriteDetailPage = () => {
    if (token) {
      navigate(`/WriteDetailPage/${token}`);
    } else {
      navigate("/"); // 토큰이 없으면 메인으로
    }
  };

  return (
    <div className="SendNote">
      <div className="Header">
        <img className="SmallLogo" alt="MAIMU" src={SmallLogoImg} />
      </div>

      <div className="SendNote_Hero">
        <img className="ShareButton" alt="" aria-hidden="true" src={ShareButton} />
      </div>

      <h1 className="SendNote_MSG" role="status" aria-live="polite">
        쪽지를 보냈어요!
      </h1>
      <p className="SendNote_Sub">
        {groupName ? (
          <>
            <b>{groupName}</b> 사물함에 잘 전달됐어요.
            <br />
            내 첫인상은 어떨지 궁금하지 않나요?
          </>
        ) : (
          "쪽지가 잘 전달됐어요."
        )}
      </p>

      {/* 게스트가 서비스를 처음 만나는 순간이라, 내 사물함 만들기를 주 동작으로 둔다 */}
      <button type="button" className="ToStartPage_Button" onClick={navigateToStartPage}>
        나도 마이무 받으러 가기
      </button>
      <button type="button" className="SendNote_Button" onClick={navigateToWriteDetailPage}>
        쪽지 하나 더 쓰기
      </button>
    </div>
  );
};

export default SendNote;
