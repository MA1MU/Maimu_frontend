import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./CheckNote.css";
import SmallLogoImg from "../../images/SmallLogo.svg";

const CheckNote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const maimuId = location.state?.maimuId;
  const maimuColor = location.state?.maimuColor;
  const groupName = location.state?.groupName;
  const groupColor = location.state?.groupColor;
  const group_id = location.state?.group_id;

  const [maimu, setMaimu] = useState(null); // 마이무 상세 정보 상태

  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchMaimuData = async () => {
      if (access_token && maimuId) {
        try {
          const response = await axios.get(`${api.baseUrl}/v1/api/maimu/${maimuId}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          console.log("Maimu data fetched:", response.data);
          setMaimu(response.data);
        } catch (error) {
          console.error("Error fetching maimu data:", error);

          if (error.response && error.response.data) {
            const errorResponse = error.response.data;
            const errorMessage = errorResponse.message || "서버 오류가 발생했습니다.";

            toast.error(errorMessage, {
              autoClose: 3000,
              hideProgressBar: true,
            });
          } else {
            toast.error("서버 오류가 발생했습니다.", {
              autoClose: 3000,
              hideProgressBar: true,
            });
          }
        }
      }
    };

    fetchMaimuData();
  }, [access_token, maimuId]);

  const handleMoveToDetailPage = () => {
      const originalGroupName = decodeURI(decodeURI(groupName));
      const originalGroupColor = decodeURI(decodeURI(groupColor));
      const encodedGroupName = encodeURI(originalGroupName);
      const encodedGroupColor = encodeURI(originalGroupColor);
      MoveToDetailPage(encodedGroupName, encodedGroupColor, group_id);
  }

  const MoveToDetailPage = (groupName, groupColor, group_id) => {
    const encodedGroupName = encodeURI(groupName);
    const encodedGroupColor = encodeURI(groupColor);
    navigate(`/DetailPage/${encodedGroupName}/${encodedGroupColor}/${group_id}`);
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

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    
    // 요일 계산
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = week[date.getDay()];

    return `${year}년 ${month}월 ${day}일(${dayOfWeek}) ${ampm} ${displayHours}:${String(minutes).padStart(2, "0")}`;
  };

  return (
    <div className={`CheckNote ${getBackgroundClass()}`}>
      <div className="Header">
        <img className="SmallLogo" alt="" src={SmallLogoImg} />
      </div>
      <div className="CheckNote_Box">
        <div>
          <p className="CheckNote_T">쪽지 내용</p>
        </div>
        {maimu ? (
          <>
            <div className={`Note_T_Wrapper ${getBackgroundClass()}`}>
              <p>{maimu.title}</p>
            </div>
            <div className={`Note_C_Wrapper ${getBackgroundClass()}`}>
              <div className="Note_C">
                {maimu.message}
              </div>
            </div>
            <div className="Note_Date">
              <p>{formatDate(maimu?.createdAt)}</p>
            </div>
            <div className={`Note_NickName_Wrapper ${getBackgroundClass()}`}>
              <p>{maimu?.anonymous ? "익명" : maimu?.writerName}</p>
            </div>
          </>
        ) : (
          <div className="LoadingMessage">정보를 불러오는 중입니다...</div>
        )}
      </div>
      <button className="CheckNote_Button" onClick={handleMoveToDetailPage}>
        사물함으로 돌아가기
      </button>
    </div>
  );
};

export default CheckNote;
