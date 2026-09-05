import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify"; // toast 불러오기
import "react-toastify/dist/ReactToastify.css"; // toast 스타일 추가
import "./WriteNote.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import MaimuRed from "../../images/WriteDetailPage/MaimuRed.svg";
import MaimuYellow from "../../images/WriteDetailPage/MaimuYellow.svg";
import MaimuGreen from "../../images/WriteDetailPage/MaimuGreen.svg";

const WriteNote = () => {
  const location = useLocation();
  const token = location.state?.token;
  const groupId = location.state?.groupId;
  const groupName = location.state?.groupName;
  const Note_T_Ref = useRef();
  const Note_C_Ref = useRef();
  const Note_N_Ref = useRef();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [writerName, setWriterName] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // "핑크", "노랑", "초록" 또는 ""
  const [sugarContent, setSugarContent] = useState(50); // 기본값 50 (UI가 없으므로)
  const [isAnonymous, setIsAnonymous] = useState(false); // 익명 여부 상태 추가

  const navigate = useNavigate();

  // 익명 체크박스 변경 핸들러
  const handleAnonymousChange = () => {
    setIsAnonymous(!isAnonymous);
    if (!isAnonymous) {
      setWriterName("익명"); // 익명 선택 시 이름을 "익명"으로 자동 설정
    } else {
      setWriterName(""); // 익명 해제 시 이름 초기화
    }
  };

  // 색상 매핑 함수
  const mapColorToBackend = (color) => {
    switch (color) {
      case "핑크":
        return "RED";
      case "노랑":
        return "YELLOW";
      case "초록":
        return "GREEN";
      default:
        return "";
    }
  };

  // 쪽지 보내기 (API 통신)
  const handleSendNote = async () => {
    if (!title) {
      Note_T_Ref.current.focus();
      return;
    } else if (!message) {
      Note_C_Ref.current.focus();
      return;
    } else if (!isAnonymous && !writerName) {
      // 익명이 아닐 때만 닉네임 필수 체크
      Note_N_Ref.current.focus();
      return;
    } else if (!selectedColor) {
      toast.error("맛을 선택해주세요!");
      return;
    }

    try {
      const guestRequest = {
        title: title,
        message: message,
        maimuColor: mapColorToBackend(selectedColor),
        writerName: isAnonymous ? "익명" : writerName,
        sugarContent: sugarContent,
        isAnonymous: isAnonymous,
      };

      const response = await axios.post(
        `${api.baseUrl}/v1/api/guest/${groupId}/${token}/add`,
        guestRequest
      );

      if (response.status === 201 || response.status === 200) {
        navigate("/SendNote", { state: { token: token, groupName: groupName } });
      }
    } catch (error) {
      console.error("Error sending maimu:", error);

      if (error.response && error.response.data) {
        const errorResponse = error.response.data;
        const errorMessage = errorResponse.message || "쪽지 전송 중 오류가 발생했습니다.";
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

  // maxLength 설정 및 상태 업데이트
  const onInputHandler_Note_T = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setTitle(value);
    }
  };

  const onInputHandler_Note_C = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setMessage(value);
    }
  };

  const onInputHandler_NickName = (e) => {
    if (isAnonymous) return; // 익명일 경우 입력 방지
    const value = e.target.value;
    if (value.length <= 5) {
      setWriterName(value);
    }
  };

  // 맛은 서비스가 쓰는 세 가지. 친구가 받게 될 마이무 그림을 그대로 보여준다.
  const TASTES = [
    { name: "핑크", image: MaimuRed },
    { name: "노랑", image: MaimuYellow },
    { name: "초록", image: MaimuGreen },
  ];

  const canSend =
    title.trim() !== "" &&
    message.trim() !== "" &&
    selectedColor !== "" &&
    (isAnonymous || writerName.trim() !== "");

  // Note_T에서 enter키 막기
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 동작 막기
    }
  };

  return (
    <div className="WriteNote">
      <div className="JustifyCenter">
        <ToastContainer />
        <div className="Header">
          <img className="SmallLogo" alt="MAIMU" src={SmallLogoImg} />
        </div>
        <div className="WriteNote_Box">
          <div>
            <p className="WriteNote_T">쪽지 쓰기</p>
          </div>
          <div className="Note_T_Wrapper">
            <textarea
              className="Note_T"
              placeholder="제목 입력"
              ref={Note_T_Ref}
              value={title}
              onKeyDown={handleKeyDown}
              onChange={onInputHandler_Note_T}
            ></textarea>
            <p className="Count_Note_T">
              <span>{title.length}/15</span>
            </p>
          </div>
          <div className="Note_C_Wrapper">
            <textarea
              className="Note_C"
              placeholder="내용을 입력하세요"
              ref={Note_C_Ref}
              value={message}
              onKeyDown={handleKeyDown}
              onChange={onInputHandler_Note_C}
            ></textarea>
            <p className="Count_Note_C">
              <span>{message.length}/200</span>
            </p>
          </div>
          <div className="Sugar_Content_Wrapper">
            <p className="Sugar_Label">당도 설정</p>
            <div className="Slider_Container">
              <input
                type="range"
                min="0"
                max="100"
                value={sugarContent}
                onChange={(e) => setSugarContent(Number(e.target.value))}
                className="Sugar_Slider"
              />
              <p className="Sugar_Value">{sugarContent}%</p>
            </div>
          </div>
        </div>
        {/* 맛 · 닉네임 · 익명이 카드 밖에 흩어져 있어 한 폼으로 안 읽혔다. 카드 안으로 넣는다. */}
        <div className="Note_Info_Wrapper">
          <p className="Info_Label">마이무 맛</p>
          <div className="TasteChoices" role="radiogroup" aria-label="마이무 맛">
            {TASTES.map(({ name, image }) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={selectedColor === name}
                className={`TasteChoice ${selectedColor === name ? "isSelected" : ""}`}
                onClick={() => setSelectedColor(name)}
              >
                <img src={image} alt="" aria-hidden="true" />
                {name}
              </button>
            ))}
          </div>

          <div className="WriterRow">
            <div className="NickName_Wrapper">
              <label className="Info_Label" htmlFor="writer-name">보내는 사람</label>
              <input
                id="writer-name"
                type="text"
                className={`Note_NickName ${isAnonymous ? "disabled" : ""}`}
                placeholder={isAnonymous ? "익명으로 보냅니다" : "닉네임"}
                ref={Note_N_Ref}
                value={isAnonymous ? "" : writerName}
                maxLength={5}
                onChange={onInputHandler_NickName}
                disabled={isAnonymous}
              />
              {!isAnonymous && (
                <p className="Count_NickName">
                  <span>{writerName.length}/5</span>
                </p>
              )}
            </div>

            <button
              type="button"
              className={`Anonymous_Wrapper ${isAnonymous ? "checked" : ""}`}
              onClick={handleAnonymousChange}
              aria-pressed={isAnonymous}
            >
              <span className={`Anonymous_Checkbox ${isAnonymous ? "checked" : ""}`} aria-hidden="true" />
              <span className="Anonymous_Text">익명</span>
            </button>
          </div>
        </div>
        <button
          type="button"
          className="WriteNote_Button"
          onClick={handleSendNote}
          disabled={!canSend}
        >
          {canSend
            ? "쪽지 보내기"
            : !title.trim()
            ? "제목을 입력해주세요"
            : !message.trim()
            ? "내용을 입력해주세요"
            : !selectedColor
            ? "마이무 맛을 골라주세요"
            : "보내는 사람을 입력해주세요"}
        </button>
      </div>
    </div>
  );
};

export default WriteNote;
