import { useEffect } from "react";
import "./LoginModal.css";
import api from '../../api/api'

import LoginXButton from "../../images/StartPage/LoginXButton.svg";
import KakaoLogin from "../../images/StartPage/KakaoLogin.svg";
import NaverLogin from "../../images/StartPage/NaverLogin.svg";
import GoogleLogin from "../../images/StartPage/GoogleLogin.svg";

const onKakaoLogin = () => {
  window.location.href =
    `${api.baseUrl}/oauth2/authorization/kakao`;
};

const onNaverLogin = () => {
  window.location.href =
    `${api.baseUrl}/oauth2/authorization/naver`;
};

const onGoogleLogin = () => {
  window.location.href =
  `${api.baseUrl}/oauth2/authorization/google`;
};

function LoginModal({ isLoginOpen, closeLoginModal }) {

    let params = new URL(window.location.href).searchParams;
    let temp_token = params.get("tempToken");

    localStorage.setItem("temp_token", temp_token);

  // 모달인데 닫는 방법이 X 버튼 하나뿐이었다. 바깥 누르기와 Esc 를 더한다.
  useEffect(() => {
    if (!isLoginOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeLoginModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLoginOpen, closeLoginModal]);

  return (
    <div
      style={{
        display: isLoginOpen ? "block" : "none",
      }}
    >
      <div className="LoginToggleOut" onClick={closeLoginModal}></div>
      <div
        className="LoginToggleBG"
        role="dialog"
        aria-modal="true"
        aria-labelledby="LoginModalTitle"
      >
        {/* div + onClick 이라 키보드로는 닫을 수 없었다 */}
        <button
          type="button"
          className="LoginXBtn"
          onClick={closeLoginModal}
          aria-label="로그인 창 닫기"
        >
          <img src={LoginXButton} alt="" aria-hidden="true" />
        </button>
        <h3 className="Login_T" id="LoginModalTitle">로그인</h3>
        <button type="button" className="KakaoLogin" onClick={onKakaoLogin}>
          카카오로 로그인하기
          <span className="KakaoLoginImg">
            <img src={KakaoLogin} alt="" aria-hidden="true" />
          </span>
        </button>
        <button type="button" className="NaverLogin" onClick={onNaverLogin}>
          네이버로 로그인하기
          <span className="NaverLoginImg">
            <img src={NaverLogin} alt="" aria-hidden="true" />
          </span>
        </button>
        <button type="button" className="GoogleLogin" onClick={onGoogleLogin}>
          구글로 로그인하기
          <span className="GoogleLoginImg">
            <img src={GoogleLogin} alt="" aria-hidden="true" />
          </span>
        </button>
        <p className="TermsOfUse">
          계속 진행하면 마이무{" "}
          {/* 같은 탭에서 약관으로 빠져나가면 모달이 닫혀 로그인을 처음부터 다시 해야 했다 */}
          <a
            className="TermsOfUse_C"
            href="https://boundless-moustache-691.notion.site/MAIMU-f42c13b9954f49658cf38fada28b13d8"
            target="_blank"
            rel="noreferrer"
          >
            서비스 이용약관
          </a>
          에 동의하고{" "}
          <a
            className="TermsOfUse_C"
            href="https://boundless-moustache-691.notion.site/MAIMU-527645677e22453394c2804cbca447c6"
            target="_blank"
            rel="noreferrer"
          >
            개인정보 처리방침
          </a>
          을 읽었음을 인정하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
