import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./LoadingPage.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import GreyMaimu from "../../images/DetailPage/GreyMaimu.svg";
import RedMaimu from "../../images/DetailPage/RedMaimu.svg";
import YellowMaimu from "../../images/DetailPage/YellowMaimu.svg";
import GreenMaimu from "../../images/DetailPage/GreenMaimu.svg";
import ThreeBubbles from "../../images/LoadingPage/ThreeBubbles.svg";

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const maimuId = location.state?.maimuId;
  const maimuColor = location.state?.maimuColor;
  const sugarContent = location.state?.sugarContent;
  const groupName = location.state?.groupName;
  const groupColor = location.state?.groupColor;
  const group_id = location.state?.group_id;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/CheckTaste", { state: { maimuId, maimuColor, sugarContent, groupName, groupColor, group_id } }); // CheckTaste 페이지로 이동
    }, 2000); // 2초 후에 이동

    return () => clearTimeout(timer); // 타이머 해제
  }, [navigate]);

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

  const getMaimuImage = () => {
    switch (maimuColor) {
      case "RED":
        return RedMaimu;
      case "YELLOW":
        return YellowMaimu;
      case "GREEN":
        return GreenMaimu;
      default:
        return GreyMaimu;
    }
  };

  return (
    <div className={`LoadingPage ${getBackgroundClass()}`}>
      <div className="JustifyCenter">
        <img className="SmallLogo" alt="" src={SmallLogoImg} />
      <div className="LoadingMaimu_Wrapper">
        <div className="ThreeBubbles">
          <img src={ThreeBubbles} alt="ThreeBubbles" />
        </div>
          <img className="GreyMaimu" src={getMaimuImage()} alt="Maimu" />
        <p className="CheckTaste_C">마이무 맛 확인 중 ...</p>
      </div>
      </div>
    </div>
  );
};

export default LoadingPage;
