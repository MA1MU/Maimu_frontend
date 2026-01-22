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

    console.log("temp_token: ", temp_token)
    localStorage.setItem("temp_token", temp_token);

  return (
    <div
      style={{
        display: isLoginOpen ? "block" : "none",
      }}
    >
      <div className="LoginToggleOut"></div>
      <div className="LoginToggleBG">
        <div className="LoginXBtn" onClick={closeLoginModal}>
          <img src={LoginXButton} alt="LoginXButton" />
        </div>
        <h3 className="Login_T">로그인</h3>
        <div className="KakaoLogin" onClick={onKakaoLogin}>
          카카오로 로그인하기
          <div className="KakaoLoginImg">
            <img src={KakaoLogin} alt="KakaoLogin" />
          </div>
        </div>
        <div className="NaverLogin" onClick={onNaverLogin}>
          네이버로 로그인하기
          <div className="NaverLoginImg">
            <img src={NaverLogin} alt="NaverLogin" />
          </div>
        </div>
        <div className="GoogleLogin" onClick={onGoogleLogin}>
          구글로 로그인하기
          <div className="GoogleLoginImg">
            <img src={GoogleLogin} alt="GoogleLogin" />
          </div>
        </div>
        <div className="TermsOfUse">
          계속 진행하면 마이무{" "}
          <a
            className="TermsOfUse_C"
            href="https://boundless-moustache-691.notion.site/MAIMU-f42c13b9954f49658cf38fada28b13d8"
          >
            서비스 이용약관
          </a>
          에 동의하고 <br />
          <a
            className="TermsOfUse_C"
            href="https://boundless-moustache-691.notion.site/MAIMU-527645677e22453394c2804cbca447c6"
          >
            개인정보 처리방침
          </a>
          을 읽었음을 인정하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
