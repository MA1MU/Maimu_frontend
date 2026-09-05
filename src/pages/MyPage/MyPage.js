import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyPage.css";
import EditButton from "../../images/MyPage/EditButton.svg";
// 프로필 수정 화면과 같은 폼이라 디자인을 공유한다 (.ProfileSettings 스코프)
import "../MyPageEdit/MyPageEdit.css";
import ProfileCitron from "../../images/ProfileCitron.svg";
import ProfilePomegranate from "../../images/ProfilePomegranate.svg";
import ProfilePlum from "../../images/ProfilePlum.svg";
import axios from 'axios'; 
import api from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const focusedIcon = location.state?.focusedIcon;

  const temp_token = localStorage.getItem("temp_token");

  const NICKNAME_MAX = 10;
  const CURRENT_YEAR = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // 월마다 실제 일수가 다르다(윤년 포함). 기존 드롭다운은 항상 1~31 이라 2월 31일도 고를 수 있었다.
  const daysInMonth = (y, m) =>
    y && m ? new Date(Number(y), Number(m), 0).getDate() : 31;
  const asOption = (v) =>
    v === "" || v === null || v === undefined ? null : { value: Number(v), label: String(v) };

  const [nickname, setNickname] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);


  const handleConfirmClick = async () => {
        
        const profileData = {
          maimuProfile: location.state?.focusedIcon,
          nickName: nickname,
          year: selectedYear?.value,
          month: selectedMonth?.value,
          date: selectedDay?.value
        };

      
        if (temp_token) {
          try {
            const response = await axios.post(`${api.baseUrl}/v1/api/member/join`, profileData, {
              headers: {
                'Authorization': `Bearer ${temp_token}`
              },
              withCredentials: true // 쿠키를 받기 위한 설정
            });
      
            
            // 헤더에서 accessToken 추출 (헤더 이름은 소문자로 변환됨)
            const newAccessToken = response.headers['accesstoken'] || response.headers['accessToken'];
            
            if (newAccessToken) {
              // 새로운 accessToken을 localStorage에 저장
              localStorage.setItem('access_token', newAccessToken);
              localStorage.removeItem('temp_token');
            }
            
            // refreshToken은 httpOnly 쿠키로 자동 저장되므로 별도 처리 불필요
            // 브라우저가 자동으로 쿠키를 저장하고 이후 요청 시 자동으로 전송함
            
            // 성공적으로 백엔드에 데이터를 보낸 후 처리할 작업
            const iconToPass = location.state?.focusedIcon;
            navigate("/MainPage", { state: { focusedIcon: iconToPass } }); 
            
          } catch (error) {
            console.error('Error sending data to backend:', error);
      
            // 오류 처리 - ErrorResponse 구조: { code, message, method, requestURI }
            if (error.response && error.response.data) {
              const errorResponse = error.response.data;
              const errorMessage = errorResponse.message || '서버 오류가 발생했습니다.';
              
              toast.error(errorMessage, {
                autoClose: 3000,
                hideProgressBar: true,
              });
            } else {
              // 네트워크 오류 등
              toast.error('서버 오류가 발생했습니다.', {
                autoClose: 3000,
                hideProgressBar: true,
              });
            }
          }
        }
  };



  const getProfileImage = (iconName) => {
    switch (iconName) {
      case "유자":
        return { image: ProfileCitron, backgroundClass: "CitronBackground"};
      case "매실":
        return { image: ProfilePlum, backgroundClass: "PlumBackground" };
      case "석류":
        return { image: ProfilePomegranate, backgroundClass: "PomegranateBackground" };
      default:
        return null;
    }
  };


  const profileInfo = getProfileImage(focusedIcon);

  const MoveToProfileEdit = () => {
    if (temp_token) {
      navigate(`/ProfileEdit`);
    } else {
      console.log("Token이 없습니다.")
    }
  };

  const dayCount = daysInMonth(selectedYear?.value, selectedMonth?.value);
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);
  const isComplete = Boolean(nickname && selectedYear && selectedMonth && selectedDay);

  return (
    <div className={`ProfileSettings isJoin ${profileInfo?.backgroundClass || ""}`}>
      <ToastContainer />

      <header className="PsHeader">
        <h1 className="PsTitle">프로필 만들기</h1>
      </header>
      <p className="PsJoinLead">마이무에서 사용할 프로필을 설정해주세요</p>

      <div className="PsBody">
        <div className="PsAvatarBlock">
          <button
            type="button"
            className="PsAvatar"
            onClick={MoveToProfileEdit}
            aria-label="프로필 이미지 변경"
          >
            <img className="PsAvatarImg" src={profileInfo?.image} alt={focusedIcon || "프로필"} />
            <img className="PsAvatarBadge" src={EditButton} alt="" aria-hidden="true" />
          </button>
          <button type="button" className="PsAvatarLabel" onClick={MoveToProfileEdit}>
            프로필 변경
          </button>
        </div>

        <div className="PsField">
          <div className="PsFieldTop">
            <label className="PsLabel" htmlFor="join-nickname">닉네임</label>
            <span className={`PsCount ${(nickname || "").length >= NICKNAME_MAX ? "isMax" : ""}`}>
              {(nickname || "").length}/{NICKNAME_MAX}
            </span>
          </div>
          <input
            id="join-nickname"
            className="PsInput"
            value={nickname || ""}
            maxLength={NICKNAME_MAX}
            placeholder="닉네임을 입력하세요"
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="PsField">
          <div className="PsFieldTop">
            <span className="PsLabel">생년월일</span>
          </div>
          <div className="PsBirthRow">
            <select
              className="PsSelect"
              required
              aria-label="태어난 연도"
              value={selectedYear?.value ?? ""}
              onChange={(e) => setSelectedYear(asOption(e.target.value))}
            >
              <option value="" disabled>년</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>

            <select
              className="PsSelect"
              required
              aria-label="태어난 월"
              value={selectedMonth?.value ?? ""}
              onChange={(e) => {
                const m = asOption(e.target.value);
                setSelectedMonth(m);
                const max = daysInMonth(selectedYear?.value, m?.value);
                if (selectedDay && selectedDay.value > max) setSelectedDay(null);
              }}
            >
              <option value="" disabled>월</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <select
              className="PsSelect"
              required
              aria-label="태어난 일"
              value={selectedDay?.value ?? ""}
              onChange={(e) => setSelectedDay(asOption(e.target.value))}
            >
              <option value="" disabled>일</option>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="PsFooter">
        <button
          type="button"
          className="PsSave"
          onClick={handleConfirmClick}
          disabled={!isComplete}
        >
          {isComplete
            ? "시작하기"
            : !nickname
            ? "닉네임을 입력해주세요"
            : "생년월일을 선택해주세요"}
        </button>
      </div>
    </div>
  );
};

export default MyPage;