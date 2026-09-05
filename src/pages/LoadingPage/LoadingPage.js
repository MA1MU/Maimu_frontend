import React, { useCallback, useEffect } from "react";
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

  const goNext = useCallback(() => {
    navigate("/CheckTaste", {
      replace: true, // 뒤로가기로 로딩 화면에 다시 갇히지 않도록
      state: { maimuId, maimuColor, sugarContent, groupName, groupColor, group_id },
    });
  }, [navigate, maimuId, maimuColor, sugarContent, groupName, groupColor, group_id]);

  useEffect(() => {
    // 필요한 정보 없이 들어온 경우(주소 직접 입력, 새로고침) 빈 화면으로 넘어가지 않게 한다.
    if (maimuId === undefined) {
      navigate("/MainPage", { replace: true });
      return;
    }
    const timer = setTimeout(goNext, 2000);
    return () => clearTimeout(timer);
  }, [goNext, navigate, maimuId]);

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
        <img className="SmallLogo" alt="MAIMU" src={SmallLogoImg} />
        <div className="LoadingMaimu_Wrapper">
          <div className="ThreeBubbles">
            <img src={ThreeBubbles} alt="" aria-hidden="true" />
          </div>
          <img className="GreyMaimu" src={getMaimuImage()} alt="" aria-hidden="true" />
          <p className="CheckTaste_C" role="status" aria-live="polite">
            마이무 맛 확인 중
          </p>
          {/* 막대가 차는 시간(2s)이 실제 대기 시간과 같다 */}
          <div className="LoadingBar" aria-hidden="true">
            <i />
          </div>
          {/* 2초를 그냥 기다리게만 두지 않고 건너뛸 수 있게 한다 */}
          <button type="button" className="SkipHint" onClick={goNext}>
            바로 확인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
