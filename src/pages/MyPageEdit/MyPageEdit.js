import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyPageEdit.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import EditButton from "../../images/MyPage/EditButton.svg";
import BirthSelect from "../../components/BirthSelect/BirthSelect";
import ProfileCitron from "../../images/ProfileCitron.svg";
import ProfilePomegranate from "../../images/ProfilePomegranate.svg";
import ProfilePlum from "../../images/ProfilePlum.svg";
import axios from 'axios'; 
import api from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPageEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const focusedIcon = location.state?.focusedIcon;

  const access_token = localStorage.getItem("access_token");
  console.log("access_token: ", access_token);

  const [nickname, setNickname] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleConfirmClick = async () => {
    if (!nickname) {
      toast.error("닉네임을 입력해주세요!");
      return;
    }
    if (!selectedYear || !selectedMonth || !selectedDay) {
      toast.error("생년월일을 선택해주세요!");
      return;
    }

    try {
      const profileRequest = {
        maimuProfile: focusedIcon,
        year: Number(selectedYear.value),
        month: Number(selectedMonth.value),
        date: Number(selectedDay.value),
        nickName: nickname,
      };

      console.log("Updating Profile:", profileRequest);

      const response = await axios.patch(
        `${api.baseUrl}/v1/api/member/edit`,
        profileRequest,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("프로필이 수정되었습니다!", {
          autoClose: 2000,
          hideProgressBar: true,
        });
        // 성공 시 메인페이지로 이동
        setTimeout(() => {
          navigate("/MainPage", { state: { focusedIcon: focusedIcon } });
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response && error.response.data) {
        const errorResponse = error.response.data;
        const errorMessage = errorResponse.message || "프로필 수정 중 오류가 발생했습니다.";
        toast.error(errorMessage, {
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error("서버 오류가 발생했습니다. 다시 시도해주세요.", {
          autoClose: 3000,
          hideProgressBar: true,
        });
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
    if (access_token) {
      navigate(`/MyPageProfileEdit`);
    } else {
      console.log("accessToken이 없습니다.")
    }
  };

  const handleLogout = async () => {
    try {
      const logoutRequest = {
        accessToken: access_token,
      };

      console.log("Logging out...");

      await axios.post(`${api.baseUrl}/v1/api/auth/logout`, logoutRequest, {
        withCredentials: true, // refreshToken 쿠키를 포함하기 위해 설정
      });

      // 성공 여부와 상관없이 로컬 스토리지 비우기 및 이동
      localStorage.removeItem("access_token");
      toast.success("로그아웃되었습니다.", {
        autoClose: 2000,
        hideProgressBar: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error during logout:", error);
      // 에러가 발생해도 일단 로컬 토큰은 지우고 홈으로 보냅니다.
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  const handleWithdrawal = () => {
    navigate('/Withdrawal', { state: { focusedIcon: focusedIcon } });
  };

  return (
    <div className={`MyPage ${profileInfo?.backgroundClass}`}>
       <ToastContainer />
      <div className="JustifyCenter">
        <img className="SmallLogoImg" src={SmallLogoImg} alt="SmallLogo" />
        <img className="ProfileImage" src={profileInfo?.image} alt={focusedIcon} onClick={MoveToProfileEdit}/>
        <div className="Nickname">
          닉네임
          <input
            className="NicknameInput"
            value={nickname || ''}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="Birth">
          생년월일
          <BirthSelect
            onSelectYear={setSelectedYear}
            onSelectMonth={setSelectedMonth}
            onSelectDay={setSelectedDay}
          />
        </div>
          <div className="MyPageButtonGroup">
            <button className="Confirmation" onClick={handleConfirmClick}>
              확인
            </button>
            <div className="MyPageGroup">
              <p className="Logout" onClick={handleLogout}>로그아웃</p>
              <p onClick={handleWithdrawal}>탈퇴</p>
            </div>
          </div>
        <img className="ProfileEditButon" src={EditButton} alt="ProfileEditButon" onClick={MoveToProfileEdit}/>
      </div>
    </div>
  );
};
//

export default MyPageEdit;