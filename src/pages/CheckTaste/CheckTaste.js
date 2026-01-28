import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./CheckTaste.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import Taste_Pink from "../../images/CheckTaste/Taste_Pink.svg";
import Taste_Red from "../../images/CheckTaste/Taste_Red.svg";
import Taste_Yellow from "../../images/CheckTaste/Taste_Yellow.svg";
import Taste_Green from "../../images/CheckTaste/Taste_Green.svg";

const CheckTaste = () => {
  const location = useLocation();
  const maimuId = location.state?.maimuId;
  const maimuColor = location.state?.maimuColor;
  const sugarContent = location.state?.sugarContent;
  const groupName = location.state?.groupName;
  const groupColor = location.state?.groupColor;
  const group_id = location.state?.group_id;
  const navigate = useNavigate();

  const navigateToCheckNote = () => {
    navigate("/CheckNote", { state: { maimuId, maimuColor, groupName, groupColor, group_id } });
  };

  const getBackgroundClass = () => {
    switch (maimuColor) {
      case "RED":
        return "PomegranateBackground";
      case "YELLOW":
        return "CitronBackground";
      case "GREEN":
        return "PlumBackground";
      default:
        return "";
    }
  };

  const getButtonClass = () => {
    switch (maimuColor) {
      case "RED":
        return "PomegranateButton";
      case "YELLOW":
        return "CitronButton";
      case "GREEN":
        return "PlumButton";
      default:
        return "";
    }
  };

  const getMaimuImage = () => {
    switch (maimuColor) {
      case "RED":
        return Taste_Red;
      case "YELLOW":
        return Taste_Yellow;
      case "GREEN":
        return Taste_Green;
      default:
        return Taste_Red; // 기본값
    }
  };

  return (
    <div className={`CheckTaste ${getBackgroundClass()}`}>
      <div className="Header">
        <img className="SmallLogo" alt="" src={SmallLogoImg} />
      </div>
      <div className="CheckTaste_Wrapper">
        <p className="Sugar_T">우리 사이 당도...</p>
        <div className="Taste_Pink">
          <img src={getMaimuImage()} alt={`Taste_${maimuColor}`} />
        </div>
        <p className="Percent">{sugarContent}%</p>
        <button className={`CheckTaste_Button ${getButtonClass()}`} onClick={navigateToCheckNote}>
          쪽지 확인하러 가기
        </button>
      </div>
    </div>
  );
};

export default CheckTaste;
