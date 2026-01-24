import React from "react";
import { useNavigate } from "react-router-dom";

import "./DetailMaimu.css";
import GreyMaimu from "../../images/DetailPage/GreyMaimu.svg";
import RedMaimu from "../../images/DetailPage/RedMaimu.svg";
import YellowMaimu from "../../images/DetailPage/YellowMaimu.svg";
import GreenMaimu from "../../images/DetailPage/GreenMaimu.svg";

const DetailMaimu = ({ maimuId, maimuColor, sugarContent, groupName, groupColor, group_id }) => {
  const navigate = useNavigate();
  
  const navigateToLoadingPage = () => {
    navigate("/LoadingPage", { state: { maimuId, maimuColor, sugarContent, groupName, groupColor, group_id } });
  };

  return (
    <img
      className="GreyMaimu"
      src={GreyMaimu}
      alt="GreyMaimu"
      onClick={navigateToLoadingPage}
    />
  );
};

export default DetailMaimu;
