import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./WriteDetailPage.css";
import "../../components/PasteLinkAlert/PasteLinkAlert.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import HelpIcon from "../../images/MainPage/HelpIcon.svg";
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
            {/* 도움말이 콘텐츠 위에 떠 있던 것을 헤더 줄로 옮긴다 (로그인 화면과 동일한 구조) */}
            <header className="GuestHeader">
              <span className="GuestHeaderSpacer" aria-hidden="true" />
              <img className="SmallLogo" alt="MAIMU" src={SmallLogoImg} />
              <button
                type="button"
                className="WriteHelpIcon"
                onClick={openInformationModal}
                aria-label="마이무 이용 안내 보기"
                aria-haspopup="dialog"
              >
                <img src={HelpIcon} alt="" aria-hidden="true" />
              </button>
            </header>

            <h1 className="GroupName">{groupData?.groupName || "불러오는 중..."}</h1>
            <p className="GuestSubtitle">
              {groupData ? "이 사물함에 첫인상을 남겨보세요" : " "}
            </p>
            {/* 처음 온 사람은 이 회색 마이무가 뭔지 알 수 없다.
                무엇인지, 왜 못 여는지, 지금 뭘 하면 되는지를 알려준다. */}
            {groupData && (groupData.maimuCount || 0) > 0 ? (
              <>
                <div className="GuestNoteCount">
                  이미 도착한 쪽지 {groupData.maimuCount}개
                </div>
                <div className="DetailMaimu">
                  {Array.from({ length: groupData.maimuCount }).map((_, index) => (
                    <BlankMaimu key={index} />
                  ))}
                </div>
                <p className="GuestNoteHint">
                  다른 친구들이 남긴 쪽지예요.<br />
                  내용은 사물함 주인만 열어볼 수 있어요.
                </p>
              </>
            ) : (
              groupData && (
                <p className="GuestEmptyHint">
                  아직 아무도 쪽지를 남기지 않았어요.<br />
                  첫 번째 쪽지의 주인공이 되어보세요!
                </p>
              )
            )}

            <InformationModal
              isInformationOpen={isInformationModalOpen}
              closeInformationModal={closeInformationModal}
              page="WriteDetailPage"
            />
          </div>
        </div>
      </div>
      <button type="button" className="WriteDetail_Button" onClick={navigateToWriteNote}>
        쪽지 작성하기
      </button>
    </div>
  );
};

export default WriteDetailPage;
