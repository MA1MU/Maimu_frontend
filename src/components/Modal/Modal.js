import React, { useState, useEffect } from "react";
import "./Modal.css";
import ColorDropdown from "../ColorDropdown/ColorDropdown";
import api from "../../api/api";
import axios from "axios";
import { toast } from "react-toastify";

const Modal = ({ isOpen, onClose, clickedButton, onSave, locker, lockers }) => {
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("핑크");

  const access_token = localStorage.getItem("access_token");

  const checkDuplicateGroupName = (name) => {
    return lockers.some((locker) => locker.groupName === name && locker.groupName !== "");
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
      alert("그룹명을 입력하세요.");
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

  return (
    <div className="ModalContainer" onClick={onClose}>
      <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
        <h1 className="ModalTitle">{modalTitle}</h1>
        <h1 className="GroupNameText">그룹명</h1>
        <input
          className="GroupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <h1 className="GroupText">그룹 색상</h1>
        <ColorDropdown
          selectedColor={groupColor}
          onSelectColor={(color) => setGroupColor(color)}
        />
        <button className="CloseButton" onClick={onClose}>
          취소
        </button>
        <button
          className="SaveButton"
          onClick={handleSave}
          disabled={!groupName.trim()}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default Modal;
