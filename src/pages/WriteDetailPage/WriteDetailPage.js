import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./WriteDetailPage.css";
import "../../components/PasteLinkAlert/PasteLinkAlert.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import WriteHelpTip from "../../images/WriteDetailPage/WriteHelpTip.svg";
import InformationModal from "../../components/InformationModal/InformationModal";
import BlankMaimu from "../../components/BlankMaimu/BlankMaimu";

const WriteDetailPage = () => {
  const { token } = useParams();

  const navigate = useNavigate();
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [groupData, setGroupData] = useState(null); // 그룹 상세 정보 상태

  const openInformationModal = () => setIsInformationModalOpen(true);
  const closeInformationModal = () => setIsInformationModalOpen(false);

  useEffect(() => {
    const fetchInviteData = async () => {
      if (token) {
        try {
          const response = await axios.get(`${api.baseUrl}/v1/api/guest/invitation/${token}`);

          setGroupData(response.data);
        } catch (error) {
          console.error("Error fetching invitation data:", error);

          if (error.response && error.response.data) {
            const errorResponse = error.response.data;
            const errorMessage = errorResponse.message || "유효하지 않은 링크이거나 서버 오류가 발생했습니다.";

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

    fetchInviteData();
  }, [token]);

  // 빈칸 있으면 포커싱, 맛선택 미완료 시 알림창
  const navigateToWriteNote = () => {
    if (groupData?.id) {
      navigate("/WriteNote", { state: { token: token, groupId: groupData.id, groupName: groupData.groupName } });
    }
  };

  const getBackgroundColor = () => {
    if (!groupData) return "linear-gradient(180deg, #FEE4DE 3.37%, #FCEDDE 18.57%, #FCFCFC 42.08%)";

    switch (groupData.groupColor) {
      case "핑크":
        return "linear-gradient(180deg, #FFE0E0 0%, rgba(249, 229, 195, 0.50) 34.84%, rgba(255, 255, 255, 0.56) 76%)";
      case "노랑":
        return "linear-gradient(180deg, #FFF9C3 0%, rgba(255, 255, 255, 0.97) 71.21%)";
      case "초록":
        return "linear-gradient(180deg, #DCFDAC 0%, rgba(255, 255, 255, 0.55) 58.77%)";
      default:
        return "linear-gradient(180deg, #FEE4DE 3.37%, #FCEDDE 18.57%, #FCFCFC 42.08%)"; // 기본 배경색
    }
  };


  return (
    <div className="WriteDetailPage" style={{ background: getBackgroundColor() }}>
      <div className="WriteDetailPageScroll">
        <div className="JustifyCenter">
          <ToastContainer />
          <div className="WriteDetailPageContent">
            <img className="SmallLogo" alt="" src={SmallLogoImg} />
            <div className="GroupName">{groupData?.groupName || "불러오는 중..."}</div>
            <img
              className="WriteHelpIcon"
              alt="WriteHelpIcon"
              src={WriteHelpTip}
              onClick={openInformationModal}
            />
            <div className="DetailMaimu">
              {groupData && Array.from({ length: groupData.maimuCount || 0 }).map((_, index) => (
                <BlankMaimu key={index} />
              ))}
            </div>

            <InformationModal
              isInformationOpen={isInformationModalOpen}
              closeInformationModal={closeInformationModal}
              page="WriteDetailPage"
            />
          </div>
        </div>
      </div>
      <div className="WriteDetail_Button" onClick={navigateToWriteNote}>
        쪽지 작성하기
      </div>
    </div>
  );
};

export default WriteDetailPage;
