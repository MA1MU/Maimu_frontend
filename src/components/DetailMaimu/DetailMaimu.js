import React from "react";
import { useNavigate } from "react-router-dom";

import "./DetailMaimu.css";
import GreyMaimu from "../../images/DetailPage/GreyMaimu.svg";
import RedMaimu from "../../images/DetailPage/RedMaimu.svg";
import YellowMaimu from "../../images/DetailPage/YellowMaimu.svg";
import GreenMaimu from "../../images/DetailPage/GreenMaimu.svg";
import FavoriteRed from "../../images/DetailPage/FavoriteRed.svg";
import FavoriteYellow from "../../images/DetailPage/FavoriteYellow.svg";
import FavoriteGreen from "../../images/DetailPage/FavoriteGreen.svg";

const DetailMaimu = ({ maimu, groupName, groupColor, group_id }) => {
  const navigate = useNavigate();
  
  // 넘겨받은 maimu 객체에서 속성 추출
  const { maimuId, maimuColor, sugarContent, read, favorite } = maimu;

  const getMaimuImage = () => {
    // 1. 즐겨찾기 상태인 경우
    if (favorite) {
      switch (maimuColor) {
        case "RED":
          return FavoriteRed;
        case "YELLOW":
          return FavoriteYellow;
        case "GREEN":
          return FavoriteGreen;
        default:
          return FavoriteRed;
      }
    }

    // 2. 즐겨찾기가 아니고 읽은 상태인 경우
    if (read) {
      switch (maimuColor) {
        case "RED":
          return RedMaimu;
        case "YELLOW":
          return YellowMaimu;
        case "GREEN":
          return GreenMaimu;
        default:
          return RedMaimu;
      }
    }

    // 3. 읽지 않은 상태인 경우
    return GreyMaimu;
  };

  const navigateToLoadingPage = () => {
    // 객체 필드를 개별적으로 넘기거나, maimu 객체 통째로 넘길 수 있습니다.
    navigate("/LoadingPage", { 
      state: { 
        maimuId, 
        maimuColor, 
        sugarContent, 
        groupName, 
        groupColor, 
        group_id 
      } 
    });
  };

  return (
    <img
      className="GreyMaimu"
      src={getMaimuImage()}
      alt={read ? `${maimuColor}Maimu` : "GreyMaimu"}
      onClick={navigateToLoadingPage}
    />
  );
};

export default DetailMaimu;
