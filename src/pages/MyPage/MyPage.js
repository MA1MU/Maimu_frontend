import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyPage.css";
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

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const access_token = localStorage.getItem("access_token");
  // console.log("access_token: ", access_token)

  const [nickname, setNickname] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  
  const headers = {
    'Authorization': `Bearer ${access_token}`
  };


  const handleConfirmClick = async () => {
        
        const profileData = {
          maimuProfile: location.state?.focusedIcon,
          nickName: nickname,
          year: selectedYear?.value,
          month: selectedMonth?.value,
          date: selectedDay?.value
        };

      
        if (access_token) {
          try {
            const response = await axios.post(`${api.baseUrl}/v1/api/member/join`, profileData, {
              headers: headers,
              withCredentials: true // 쿠키를 받기 위한 설정
            });
      
            console.log('Backend response:', response.data);
            
            // 헤더에서 accessToken 추출 (헤더 이름은 소문자로 변환됨)
            const newAccessToken = response.headers['accesstoken'] || response.headers['accessToken'];
            
            if (newAccessToken) {
              // 새로운 accessToken을 localStorage에 저장
              localStorage.setItem('access_token', newAccessToken);
              console.log('New accessToken saved:', newAccessToken);
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${api.baseUrl}/user/info`, {
          headers: headers
        });
        const { maimuProfile, year, month, date, maimuName, role } = response.data;
        // console.log('User info from backend:', response.data);
        setUserInfo({
          maimuProfile,
          year,
          month,
          date,
          maimuName,
          role
        });

        if (role === 'ROLE_USER') {
          setNickname(maimuName); 
          setSelectedYear(year);
          setSelectedMonth(month);
          setSelectedDay(date);
          setRole(role);

          console.log('Nickname:', maimuName);
          console.log('Selected Year:', year);
          console.log('Selected Month:', month);
          console.log('Selected Day:', date);
          console.log('Role:', role);

        }
      } catch (error) {
        setError(error.response.data.message);
      }
    };

    fetchUserInfo();
  }, [access_token]);

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

  const focusedIcon = location.state?.focusedIcon;
  const profileInfo = getProfileImage(focusedIcon);

  const MoveToProfileEdit = () => {
    if (access_token) {
      navigate(`/ProfileEdit`);
    } else {
      console.log("accessToken이 없습니다.")
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const handleWithdrawal = () => {
    navigate('/Withdrawal');
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
        {role === 'ROLE_USER' ? (
          <div className="MyPageButtonGroup">
            <button className="Confirmation" disabled={!access_token} onClick={handleConfirmClick}>
              확인
            </button>
            <div className="MyPageGroup">
              <p className="Logout" onClick={handleLogout}>로그아웃</p>
              <p onClick={handleWithdrawal}>탈퇴</p>
            </div>
          </div>
        ) : (
          <div className="MyPageButtonGroup">
            <button className="Confirmation" onClick={handleConfirmClick}>
              확인
            </button>
          </div>
        )}
        <img className="ProfileEditButon" src={EditButton} alt="ProfileEditButon" onClick={MoveToProfileEdit}/>
      </div>
    </div>
  );
};
//

export default MyPage;