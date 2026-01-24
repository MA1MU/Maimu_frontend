import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./CheckTaste.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import Taste_Pink from "../../images/CheckTaste/Taste_Pink.svg";

const CheckTaste = () => {
  const location = useLocation();
  const maimuId = location.state?.maimuId;
  const maimuColor = location.state?.maimuColor;
  const groupName = location.state?.groupName;
  const groupColor = location.state?.groupColor;
  const group_id = location.state?.group_id;
  const navigate = useNavigate();

  const navigateToCheckNote = () => {
    console.log("groupName:", groupName);
    console.log("groupColor:", groupColor);
    console.log("group_id:", group_id);
    console.log(decodeURI(decodeURI(groupName)));
    console.log(decodeURI(decodeURI(groupColor)));
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

  return (
    <div className={`CheckTaste ${getBackgroundClass()}`}>
      <div className="Header">
        <img className="SmallLogo" alt="" src={SmallLogoImg} />
      </div>
      <div className="CheckTaste_Wrapper">
        <p className="Sugar_T">우리 사이 당도...</p>
        <div className="Taste_Pink">
          <img src={Taste_Pink} alt="Taste_Pink" />
        </div>
        <p className="Percent">32%</p>
        <button className={`CheckTaste_Button ${getButtonClass()}`} onClick={navigateToCheckNote}>
          쪽지 확인하러 가기
        </button>
      </div>
    </div>
  );
};

export default CheckTaste;
