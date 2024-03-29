import React, { useState } from "react";
import "./StartPage.css";

import WallPaper from "../../images/StartPage/WallPaper.svg";
import LoginButton from "../../images/StartPage/LoginButton.svg";
import InformationButton from "../../images/StartPage/InformationButton.svg";
import LoginModal from "../../components/LoginModal/LoginModal.js";
import InformationModal from "../../components/InformationModal/InformationModal.js";

import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openInformationModal = () => setIsInformationModalOpen(true);
  const closeInformationModal = () => setIsInformationModalOpen(false);

  return (
    <div className="StartPage">
      <div className="JustifyCenter">
        <div className="WallPaper">
          <img src={WallPaper} alt="WallPaper" />

          <div className="InformationButton" onClick={openInformationModal}>
            <img src={InformationButton} alt="InformationButton" />
          </div>
          <div className="LoginButton" onClick={openLoginModal}>
            <img src={LoginButton} alt="LoginButton" />
          </div>
          <LoginModal
            isLoginOpen={isLoginModalOpen}
            closeLoginModal={closeLoginModal}
          />
          <InformationModal
            isInformationOpen={isInformationModalOpen}
            closeInformationModal={closeInformationModal}
            page="StartPage"
          />
        </div>
      </div>
    </div>
  );
};

export default StartPage;
