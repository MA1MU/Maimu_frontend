import React, { useState, useEffect } from "react";
import "./MainPage.css";
import Locker from "../../components/Locker/Locker";
import SmallLogoImg from "../../images/SmallLogo.svg";
import ProfilePomegranate from "../../images/ProfilePomegranate.svg";
import ProfileCitron from "../../images/ProfileCitron.svg";
import ProfilePlum from "../../images/ProfilePlum.svg";
import Modal from "../../components/Modal/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import HelpIcon from "../../images/MainPage/HelpIcon.svg";
import InformationModal from "../../components/InformationModal/InformationModal";
import WarningModal from "../../components/WarningModal/WarningModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../../api/api";

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [selectedLockerInfo, setSelectedLockerInfo] = useState(null); // 선택된 사물함의 정보를 저장하는 상태
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [lockers, setLockers] = useState(Array.from({ length: 9 }, () => ({ groupName: "", groupColor: "", group_id: null, unreadMaimuCount: 0 })));
  const [profileInfo, setProfileInfo] = useState(null); // 사용자 프로필 아이콘 상태

  const access_token = localStorage.getItem("access_token");

  // 프로필 아이콘과 배경 클래스를 가져오는 함수
  const getProfileImage = (iconName) => {
    switch (iconName) {
      case "유자":
        return { image: ProfileCitron, backgroundClass: "CitronBackground" };
      case "매실":
        return { image: ProfilePlum, backgroundClass: "PlumBackground" };
      case "석류":
        return { image: ProfilePomegranate, backgroundClass: "PomegranateBackground" };
      default:
        return { image: ProfilePomegranate, backgroundClass: "PomegranateBackground" }; // 기본값
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (access_token) {
        try {
          const response = await axios.get(`${api.baseUrl}/v1/api/group/all`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          setProfileInfo(response.data.maimuProfile);
          // ResponseDTO로 감싸진 응답에서 data 배열 추출
          const groupList = response.data.data || [];
          
          // GroupResponse 배열을 lockers 형식으로 변환
          const newLockers = groupList.map((item) => ({
            groupName: item.groupName || "",
            groupColor: item.groupColor || "",
            group_id: item.id || null,
            unreadMaimuCount: item.unreadMaimuCount || 0,
          }));

          // 9개 고정 배열로 만들기 (빈 사물함으로 채우기)
          const updatedLockers = Array.from({ length: 9 }, (_, index) => {
            if (index < newLockers.length) {
              return newLockers[index];
            }
            return { groupName: "", groupColor: "", group_id: null, unreadMaimuCount: 0 };
          });

          setLockers(updatedLockers);

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

    fetchData();
  }, [access_token]);

  useEffect(() => {
    // 현재 페이지의 히스토리를 하나 더 추가하여 뒤로 가기를 눌러도 현재 페이지에 머물게 함
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      // 사용자가 뒤로 가기를 눌렀을 때 실행됨
      window.history.pushState(null, null, window.location.href);
    };

    // popstate 이벤트 리스너 등록
    window.addEventListener("popstate", handlePopState);

    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const addButtonClick = (groupName) => {
    if (lockers.filter((locker) => locker.groupName !== "").length >= 9) {
      toast.error("최대 9개까지 그룹을 생성할 수 있습니다.");
      return;
    }

    const emptyLockerIndex = lockers.findIndex((locker) => locker.groupName === "" && locker.groupColor === "");

    if (emptyLockerIndex === -1) {
      toast.error("모든 그룹이 채워져 있습니다.");
      return;
    }

    setClickedButton("add");
    setModalOpen(true);
    setIsEditing(false);
    setIsDeleting(false);
    setSelectedLocker(emptyLockerIndex);
    setSelectedLockerInfo(null);
  };

  const editButtonClick = () => {
    setClickedButton("edit");
    setIsDeleting(false);
    setIsEditing((prevEditing) => !prevEditing);
  };

  const delButtonClick = () => {
    setClickedButton("delete");
    setIsDeleting((prevDeleting) => !prevDeleting);
    setIsEditing(false);
  };

  const onSave = (groupName, groupColor, group_id) => {
    if (clickedButton === "add") {
      const newGroup = {
        groupName: groupName,
        groupColor: groupColor,
        group_id: group_id,
        unreadMaimuCount: 0,
      };

      const updatedLockers = [...lockers];
      updatedLockers[selectedLocker] = newGroup;

      setLockers(updatedLockers);

    }

    setModalOpen(false);
    setClickedButton(null);
    setIsEditing(false);
    setIsDeleting(false);
    setSelectedLocker(null);
    setSelectedLockerInfo(null);
  };

  const handleLockerClick = (index) => {
    if (lockers[index].groupName !== "" && !isDeleting && !isEditing) {
      const encodedGroupName = encodeURI(lockers[index].groupName);
      const encodedGroupColor = encodeURI(lockers[index].groupColor);
      MoveToDetailPage(encodedGroupName, encodedGroupColor, lockers[index].group_id);
    } else if (lockers[index].groupName !== "" && isEditing) {
      setSelectedLocker(index);
      setModalOpen(true);
      setSelectedLockerInfo(lockers[index]);
    } else {
      setSelectedLocker(index);
      setWarningModalOpen(true);
    }
  };

  const handleWarningModalClose = () => {
    setWarningModalOpen(false);
  };

  const handleDelete = async (group_id) => {
    try {
      const response = await axios.delete(`${api.baseUrl}/v1/api/group/${group_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
  
      const updatedLockers = lockers.filter((locker) => locker.group_id !== group_id);
      const emptyLocker = {
        groupName: "",
        groupColor: "",
        group_id: null,
        unreadMaimuCount: 0,
      };
  
      if (updatedLockers.length < 9) {
        const numEmptyLockersToAdd = 9 - updatedLockers.length;
        for (let i = 0; i < numEmptyLockersToAdd; i++) {
          updatedLockers.push(emptyLocker);
        }
      }
  
      setLockers(updatedLockers);
      setWarningModalOpen(false);
      setIsDeleting(false);
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
  };
  
  

  const MoveToMyPage = () => {
    navigate("/MyPageEdit", { state: { focusedIcon: profileInfo } });
  };

  const MoveToDetailPage = (groupName, groupColor, group_id) => {
    const encodedGroupName = encodeURI(groupName);
    const encodedGroupColor = encodeURI(groupColor);
    navigate(`/DetailPage/${encodedGroupName}/${encodedGroupColor}/${group_id}`);
  };

  const openInformationModal = () => setIsInformationModalOpen(true);
  const closeInformationModal = () => setIsInformationModalOpen(false);

  return (
    <div className={`MainPage ${getProfileImage(profileInfo)?.backgroundClass || ""}`}>
      <div className="JustifyCenter">
        <ToastContainer />

        <img className="SmallLogo" alt="" src={SmallLogoImg} />

        <div className="LockerContainer">
          {lockers.map((locker, index) => (
            <Locker
              key={index}
              GroupName={locker.groupName}
              groupColor={locker.groupColor}
              unreadMaimuCount={locker.unreadMaimuCount}
              isEditing={isEditing}
              isDeleting={isDeleting}
              onClick={() => handleLockerClick(index)}
            />
          ))}
        </div>

        <div className="EditGroup">
          <button
            className={`EditButton ${clickedButton === "add" ? "clicked" : ""}`}
            onClick={() => addButtonClick("새 그룹")}
          >
            추가
          </button>
          <button
            className={`EditButton ${clickedButton === "edit" && isEditing ? "clicked" : ""}`}
            onClick={editButtonClick}
          >
            편집
          </button>
          <button
            className={`EditButton ${
              clickedButton === "delete" && isDeleting ? "clicked" : ""
            }`}
            onClick={delButtonClick}
          >
            삭제
          </button>

          {modalOpen && (
            <Modal
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setIsEditing(false);
                setClickedButton(null);
                setSelectedLocker(null);
                setSelectedLockerInfo(null);
              }}
              onSave={onSave}
              clickedButton={clickedButton}
              locker={selectedLockerInfo} // 이 부분을 수정
            />
          )}
        </div>
        <InformationModal
          isInformationOpen={isInformationModalOpen}
          closeInformationModal={closeInformationModal}
          page="MainPage"
        />

        {warningModalOpen && (
          <WarningModal
            onClose={handleWarningModalClose}
            onDelete={() => handleDelete(lockers[selectedLocker].group_id)}
            isDeleting={isDeleting}
            lockers={lockers}
            index={selectedLocker}
          />
        )}

        <img
          className="HelpIcon"
          alt="HelpIcon"
          src={HelpIcon}
          onClick={openInformationModal}
        />

        <img
          className="ProfilePomegranate"
          alt="ProfileButton"
          src={getProfileImage(profileInfo)?.image || ProfilePomegranate}
          onClick={MoveToMyPage}
        />
      </div>
    </div>
  );
};

export default MainPage;
