import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyPageEdit.css";
import EditButton from "../../images/MyPage/EditButton.svg";
import BackButton from "../../images/DetailPage/BackButton.svg";
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

  const [nickname, setNickname] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [saving, setSaving] = useState(false);
  // 서버에 저장돼 있는 프로필 아이콘. 이미지'만' 바꾼 경우를 감지하는 기준.
  const [serverProfile, setServerProfile] = useState(null);
  // 불러온 원래 값. 바뀐 게 없으면 저장 버튼을 비활성화하기 위해 보관한다.
  const [initial, setInitial] = useState(null);

  const NICKNAME_MAX = 10;
  const CURRENT_YEAR = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // 월마다 실제 일수가 다르다(윤년 포함). 기존에는 항상 1~31 이라 2월 31일도 고를 수 있었다.
  const daysInMonth = (y, m) =>
    y && m ? new Date(Number(y), Number(m), 0).getDate() : 31;
  const dayCount = daysInMonth(selectedYear?.value, selectedMonth?.value);
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  const asOption = (v) => (v === '' || v === null || v === undefined
    ? null : { value: Number(v), label: String(v) });

  // 화면에 보이는 프로필. 아이콘 변경 화면을 다녀오면 focusedIcon 이 새 값이 된다.
  const currentProfile = focusedIcon ?? serverProfile ?? null;

  const currentSnapshot = JSON.stringify({
    p: currentProfile,
    n: nickname || '',
    y: selectedYear?.value ?? null,
    m: selectedMonth?.value ?? null,
    d: selectedDay?.value ?? null,
  });
  const isDirty = initial !== null && initial !== currentSnapshot;
  const isComplete = Boolean(nickname && selectedYear && selectedMonth && selectedDay);

  // 초기 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      if (!access_token) return;

      try {
        const response = await axios.get(`${api.baseUrl}/v1/api/member/profile`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const { maimuProfile, birth, nickName } = response.data;

        // 닉네임 설정
        setNickname(nickName);

        // 생년월일 설정 (YYYY-MM-DD 형식 가정)
        let y = null, m = null, d = null;
        if (birth) {
          const [year, month, day] = birth.split('-');
          y = Number(year); m = Number(month); d = Number(day);
          setSelectedYear({ value: y, label: `${y}` });
          setSelectedMonth({ value: m, label: `${m}` });
          setSelectedDay({ value: d, label: `${d}` });
        }
        // 변경 감지 기준값
        setServerProfile(maimuProfile ?? null);
        // 기준값에도 프로필을 포함해야 이미지만 바꾼 경우가 '변경됨'으로 잡힌다.
        setInitial(JSON.stringify({ p: maimuProfile ?? null, n: nickName || '', y, m, d }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("프로필 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchProfile();
  }, [access_token, location.state?.focusedIcon]);

  const handleConfirmClick = async () => {
    if (!nickname) {
      toast.error("닉네임을 입력해주세요!");
      return;
    }
    if (!selectedYear || !selectedMonth || !selectedDay) {
      toast.error("생년월일을 선택해주세요!");
      return;
    }

    setSaving(true);
    try {
      const profileRequest = {
        maimuProfile: currentProfile, // 직접 URL 진입 등으로 focusedIcon 이 없을 때 서버 값 유지
        year: Number(selectedYear.value),
        month: Number(selectedMonth.value),
        date: Number(selectedDay.value),
        nickName: nickname,
      };

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
      setSaving(false);
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
        withCredentials: true,
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

  const handleBack = () => {
    navigate("/MainPage", { state: { focusedIcon: focusedIcon } });
  };

  return (
    <div className={`ProfileSettings ${profileInfo?.backgroundClass || ""}`}>
      <ToastContainer />

      <header className="PsHeader">
        <button type="button" className="PsBack" onClick={handleBack} aria-label="뒤로 가기">
          <img src={BackButton} alt="" aria-hidden="true" />
        </button>
        <h1 className="PsTitle">프로필 수정</h1>
      </header>

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
            <label className="PsLabel" htmlFor="ps-nickname">닉네임</label>
            <span className={`PsCount ${(nickname || "").length >= NICKNAME_MAX ? "isMax" : ""}`}>
              {(nickname || "").length}/{NICKNAME_MAX}
            </span>
          </div>
          <input
            id="ps-nickname"
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
                // 31일 -> 2월 처럼 없는 날짜가 남지 않도록 정리한다
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
          disabled={saving || !isComplete || !isDirty}
        >
          {saving ? "저장 중…" : !isDirty && isComplete ? "변경사항 없음" : "저장"}
        </button>

        <div className="PsSecondary">
          <button type="button" className="PsTextBtn" onClick={handleLogout}>
            로그아웃
          </button>
          <span className="PsDot" aria-hidden="true" />
          <button type="button" className="PsTextBtn isDanger" onClick={handleWithdrawal}>
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPageEdit;