import React, { useEffect, useState } from "react";
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

  // 당도를 0 부터 세어 올린다. 이 화면의 주인공이라 숫자가 '공개되는' 느낌을 준다.
  const target = Number.isFinite(Number(sugarContent)) ? Number(sugarContent) : null;
  const [shown, setShown] = useState(target === null ? null : 0);

  useEffect(() => {
    if (target === null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(target);
      return;
    }
    // 벽시계 시간 + requestAnimationFrame 으로 하면 첫 프레임이 늦게 올 때
    // 경과 시간이 이미 다 지나 있어 0 에서 최종값으로 한 번에 뛴다.
    // 프레임 타이밍과 무관하게 정해진 단계 수만큼 올린다.
    const STEPS = 30;
    const DURATION = 900;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      const p = Math.min(1, step / STEPS);
      const eased = 1 - Math.pow(1 - p, 3); // 끝에서 부드럽게 감속
      setShown(Math.round(target * eased));
      if (p >= 1) clearInterval(id);
    }, DURATION / STEPS);
    return () => clearInterval(id);
  }, [target]);

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
        <img className="SmallLogo" alt="MAIMU" src={SmallLogoImg} />
      </div>
      <div className="CheckTaste_Wrapper">
        <p className="Sugar_T">우리 사이 당도...</p>
        <div className="Taste_Pink">
          <img src={getMaimuImage()} alt="" aria-hidden="true" />
        </div>
        <p className="Percent">{target === null ? "?" : `${shown}%`}</p>

        {/* 숫자만 있던 자리에 당도를 눈으로도 보여준다 */}
        {target !== null && (
          <div className="SugarGauge" aria-hidden="true">
            <i style={{ width: `${Math.max(0, Math.min(100, shown))}%` }} />
          </div>
        )}
        <button className={`CheckTaste_Button ${getButtonClass()}`} onClick={navigateToCheckNote}>
          쪽지 확인하러 가기
        </button>
      </div>
    </div>
  );
};

export default CheckTaste;
