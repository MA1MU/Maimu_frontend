import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PasteLinkAlert } from "../../components/PasteLinkAlert/PasteLinkAlert";

import "./DetailPage.css";
import "../../components/PasteLinkAlert/PasteLinkAlert.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import PasteLink from "../../images/DetailPage/PasteLink.svg";
import DetailMaimu from "../../components/DetailMaimu/DetailMaimu";

const DetailPage = () => {
  const [pasteState, setPasteState] = useState(false);
  const { groupName, groupColor, group_id } = useParams();

  // URL 파라미터로 받아온 값을 디코딩
  const decodedGroupName = decodeURI(groupName);
  const decodedGroupColor = decodeURI(groupColor);

  const getBackgroundColor = () => {
    switch (decodedGroupColor) {
      case "핑크":
        return "linear-gradient(180deg, #FFE0E0 0%, rgba(249, 229, 195, 0.50) 34.84%, rgba(255, 255, 255, 0.56) 76%)";
      case "노랑":
        return "linear-gradient(180deg, #FFF9C3 0%, rgba(255, 255, 255, 0.97) 71.21%)";
      case "초록":
        return "linear-gradient(180deg, #DCFDAC 0%, rgba(255, 255, 255, 0.55) 58.77%)";
      default:
        return "linear-gradient(180deg, #FEE4DE 3.37%, #FCEDDE 18.57%, #FCFCFC 42.08%)"; // 기본 배경색
    }
  };

  return (
    <div className="DetailPage" style={{ background: getBackgroundColor() }}>
      <div className="JustifyCenter">
        <div className="DetailPageContent">
          <img className="SmallLogo" alt="" src={SmallLogoImg} />
          <div className="GroupName">{decodedGroupName}</div>
          <div className="DetailMaimu">
            <DetailMaimu />
            <DetailMaimu />
            <DetailMaimu />
            <DetailMaimu />
          </div>
          {pasteState && <PasteLinkAlert setPasteState={setPasteState} />}
        </div>
        <img
          className="PasteLink"
          alt="PasteLink"
          src={PasteLink}
          onClick={() => setPasteState(true)}
        />
      </div>
    </div>
  );
};

export default DetailPage;
