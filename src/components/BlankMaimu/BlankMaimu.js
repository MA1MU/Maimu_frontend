import React from "react";
import { useNavigate } from "react-router-dom";

import GreyMaimu from "../../images/DetailPage/GreyMaimu.svg";

const BlankMaimu = () => {
  const navigate = useNavigate();

  return (
    <img
      className="GreyMaimu"
      src={GreyMaimu}
      alt="GreyMaimu"
    />
  );
};

export default BlankMaimu;