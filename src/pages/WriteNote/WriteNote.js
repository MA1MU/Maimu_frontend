import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify"; // toast 불러오기
import "react-toastify/dist/ReactToastify.css"; // toast 스타일 추가
import "./WriteNote.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import TasteDropdown from "../../components/TasteDropdown/TasteDropdown";

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

  const navigate = useNavigate();

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
    } else if (!writerName) {
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
        writerName: writerName,
        sugarContent: sugarContent,
      };

      console.log("Sending Note:", guestRequest);

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
    const value = e.target.value;
    if (value.length <= 5) {
      setWriterName(value);
    }
  };

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
          <img className="SmallLogo" alt="" src={SmallLogoImg} />
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
        </div>
        <div className="Note_Info_Wrapper">
          <TasteDropdown onTasteSelected={setSelectedColor} />
          <div className="NickName_Wrapper">
            <textarea
              className="Note_NickName"
              placeholder="닉네임"
              ref={Note_N_Ref}
              value={writerName}
              onKeyDown={handleKeyDown}
              onChange={onInputHandler_NickName}
            ></textarea>
            <p className="Count_NickName">
              <span>{writerName.length}/5</span>
            </p>
          </div>
        </div>
        <div className="WriteNote_Button" onClick={handleSendNote}>
          쪽지 보내기
        </div>
      </div>
    </div>
  );
};

export default WriteNote;
