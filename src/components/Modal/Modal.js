import React, { useState, useEffect } from "react";
import "./Modal.css";
import PinkLocker from "../../images/MainPage/PinkLocker.svg";
import YellowLocker from "../../images/MainPage/YellowLocker.svg";
import GreenLocker from "../../images/MainPage/GreenLocker.svg";
import api from "../../api/api";
import axios from "axios";
import { toast } from "react-toastify";

const Modal = ({ isOpen, onClose, clickedButton, onSave, locker, lockers }) => {
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("핑크");

  const access_token = localStorage.getItem("access_token");

  const GROUP_NAME_MAX = 10;
  // 색상은 서비스가 쓰는 세 가지 그대로. 사물함 그림을 그대로 미리보기로 쓴다.
  const COLORS = [
    { name: "핑크", image: PinkLocker },
    { name: "노랑", image: YellowLocker },
    { name: "초록", image: GreenLocker },
  ];

  // Esc 로 닫기 — 기존에는 바깥을 클릭하는 방법뿐이었다.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const checkDuplicateGroupName = (name) => {
    return (lockers || []).some((l) => l.groupName === name && l.groupName !== "");
  };

  useEffect(() => {
    if (locker) {
      const { groupName: lockerGroupName, groupColor: lockerGroupColor } = locker;
      if (lockerGroupName) {
        setGroupName(lockerGroupName);
      }
      if (lockerGroupColor) {
        setGroupColor(lockerGroupColor);
      }
    }
  }, [locker]);

  const handleSave = async () => {
    if (!groupName.trim()) {
      toast.error("그룹명을 입력해주세요.");
      return;
    }
    

    try {
      switch (clickedButton) {
        case "add":
          try {
            const response = await axios.post(
              `${api.baseUrl}/v1/api/group`,
              {
                groupName: groupName,
                groupColor: groupColor
              },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`
                },
              }
            );
    
    
            const newGroup = {
              groupName: groupName,
              groupColor: groupColor,
              group_id: response.data.id
            };
    
            onSave(newGroup.groupName, newGroup.groupColor, newGroup.group_id);
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
          break;

        case "edit":
          if (!locker) {
            console.error("Locker object is null");
            return;
          }

          const editResponse = await axios.patch(
            `${api.baseUrl}/v1/api/group/${locker.group_id}`,
            {
              groupName: groupName,
              groupColor: groupColor
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`
              },
            }
          );

          onSave(groupName, groupColor, locker.group_id);

          window.location.reload();

          break;

        default:
          break;
      }
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

    onClose(); // 모달 닫기
  };

  if (!isOpen) {
    return null;
  }

  let modalTitle;

  switch (clickedButton) {
    case "add":
      modalTitle = "그룹 추가하기";
      break;
    case "edit":
      modalTitle = "그룹 편집하기";
      break;
    default:
  }

  const isDuplicate =
    groupName.trim() !== "" &&
    groupName.trim() !== (locker?.groupName || "") &&
    checkDuplicateGroupName(groupName.trim());

  return (
    <div className="ModalContainer" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
        <h2 className="ModalTitle">{modalTitle}</h2>

        <div className="ModalField">
          <div className="ModalFieldTop">
            <label className="ModalLabel" htmlFor="modal-group-name">그룹명</label>
            <span className={`ModalCount ${groupName.length >= GROUP_NAME_MAX ? "isMax" : ""}`}>
              {groupName.length}/{GROUP_NAME_MAX}
            </span>
          </div>
          <input
            id="modal-group-name"
            className="GroupName"
            value={groupName}
            maxLength={GROUP_NAME_MAX}
            placeholder="예) 1학년 2반"
            autoFocus
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div className="ModalField">
          <div className="ModalFieldTop">
            <span className="ModalLabel">그룹 색상</span>
          </div>
          <div className="ColorChoices" role="radiogroup" aria-label="그룹 색상">
            {COLORS.map(({ name, image }) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={groupColor === name}
                className={`ColorChoice ${groupColor === name ? "isSelected" : ""}`}
                onClick={() => setGroupColor(name)}
              >
                <img src={image} alt="" aria-hidden="true" />
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="ButtonContainer">
          <button type="button" className="CloseButton" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="SaveButton"
            onClick={handleSave}
            disabled={!groupName.trim() || isDuplicate}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
