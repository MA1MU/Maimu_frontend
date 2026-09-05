/* global Kakao */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PasteLinkAlert } from "../../components/PasteLinkAlert/PasteLinkAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../../api/api";

import "./DetailPage.css";
import "../../components/PasteLinkAlert/PasteLinkAlert.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import BackButton from "../../images/DetailPage/BackButton.svg";
import KakaoIcon from "../../images/StartPage/KakaoLogin.svg"; // 카카오 아이콘으로 사용
import DetailMaimu from "../../components/DetailMaimu/DetailMaimu";

const DetailPage = () => {
  const navigate = useNavigate();
  const [pasteState, setPasteState] = useState(false);
  const { groupName, groupColor, group_id } = useParams();
  
  // 마이무 목록 상태
  const [maimuList, setMaimuList] = useState([]);
  const [nickName, setNickName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef(null);
  const access_token = localStorage.getItem("access_token");
  const groupId = group_id ? Number(group_id) : null;

  // URL 파라미터로 받아온 값을 디코딩
  const decodedGroupName = decodeURI(groupName);
  const decodedGroupColor = decodeURI(groupColor);

  // 백엔드에서 마이무 목록 가져오기
  const fetchMaimuList = useCallback(async (page = 0, append = false) => {
    if (!groupId || !access_token) {
      return;
    }

    // 이미 로딩 중이면 중복 요청 방지
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${api.baseUrl}/v1/api/maimu/${groupId}/all`, {
        params: { page },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      
      // PageMaimuResponse 구조: { data, currentPage, totalPage }
      const { nickName, data, currentPage: responseCurrentPage, totalPage: responseTotalPage } = response.data;
      if (nickName) {
        setNickName(nickName);
        console.log(nickName);
      }
      if (append) {
        // 기존 목록에 추가 (중복 제거)
        setMaimuList((prevList) => {
          const existingIds = new Set(prevList.map(item => item.maimuId));
          const newItems = (data || []).filter(item => !existingIds.has(item.maimuId));
          return [...prevList, ...newItems];
        });
      } else {
        // 새로 설정
        setMaimuList(data || []);
      }
      
      setCurrentPage(responseCurrentPage);
      setTotalPage(responseTotalPage);
      setHasMore(responseCurrentPage < responseTotalPage - 1);
      
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
    } finally {
      setIsLoading(false);
    }
  }, [groupId, access_token, isLoading]);

  const handleCopyLink = async () => {
    if (!groupId || !access_token) return;

    try {
      // --- 사파리 대응: ClipboardItem을 이용한 비동기 복사 ---
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
        const item = new ClipboardItem({
          "text/plain": (async () => {
            // 복사 로직 내부에서 API 호출을 수행
            const response = await axios.post(
              `${api.baseUrl}/v1/api/group/${groupId}/invitation`,
              null,
              {
                params: { groupName: decodedGroupName },
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
            const token = response.data;
            return new Blob([`${window.location.origin}/WriteDetailPage/${token}`], { type: "text/plain" });
          })(),
        });

        await navigator.clipboard.write([item]);
        setPasteState(true);
        return;
      }

      // --- 기존 방식 (ClipboardItem을 지원하지 않는 환경용) ---
      const response = await axios.post(
        `${api.baseUrl}/v1/api/group/${groupId}/invitation`,
        null,
        {
          params: { groupName: decodedGroupName },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const token = response.data;
      const inviteLink = `${window.location.origin}/WriteDetailPage/${token}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteLink);
        setPasteState(true);
      } else {
        // 아주 오래된 브라우저용 Fallback
        const textArea = document.createElement("textarea");
        textArea.value = inviteLink;
        
        // 화면에 안 보이게 설정
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        // 선택 및 복사
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999); // iOS 범위를 위한 추가 설정

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setPasteState(true);
        } else {
          throw new Error("복사 명령어 실패");
        }
      }
    } catch (error) {
      console.error("Error creating invite link:", error);
      const errorMessage = error.response?.data?.message || "링크를 생성하는 중 오류가 발생했습니다.";
      toast.error(errorMessage, {
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleKakaoShare = async () => {
    if (!groupId || !access_token) return;

    try {
      // 1. 백엔드에 토큰 생성 요청 (이미 생성된 토큰이 있다면 재사용하도록 백엔드가 설계되어 있을 것입니다)
      const response = await axios.post(
        `${api.baseUrl}/v1/api/group/${groupId}/invitation`,
        null,
        {
          params: { groupName: decodedGroupName },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const token = response.data;
      const inviteLink = `${window.location.origin}/WriteDetailPage/${token}`;

      // 2. 카카오톡 공유 실행
      if (window.Kakao) {
        const kakao = window.Kakao;
        if (!kakao.isInitialized()) {
          kakao.init('e57559391d36c76b6ef41b8ce06055d1'); // 여기에 실제 카카오 JavaScript 키를 넣으세요
        }
        console.log(inviteLink);
        kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `[MAIMU] ${nickName}님의 ${decodedGroupName} 그룹 초대장`,
            description: `${decodedGroupName} 그룹에서 당신의 마음을 담은 마이무를 남겨주세요! 🍋`,
            imageUrl: 'https://raw.githubusercontent.com/MA1MU/Maimu_frontend/01ae45fdfba61e122670a598b8cec91879d24a82/src/images/StartPage/WallPaper.svg?raw=true', // 적절한 이미지 URL로 변경
            link: {
              mobileWebUrl: inviteLink,
              webUrl: inviteLink,
            },
          },
          buttons: [
            {
              title: '마이무 남기러 가기',
              link: {
                mobileWebUrl: inviteLink,
                webUrl: inviteLink,
              },
            },
          ],
          installTalk: true,
        });
      }
    } catch (error) {
      console.error("Error sharing to Kakao:", error);
      const errorMessage = error.response?.data?.message || "카카오 공유 중 오류가 발생했습니다.";
      toast.error(errorMessage, {
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  // 초기 마이무 목록 로드
  useEffect(() => {
    if (groupId && access_token) {
      setMaimuList([]);
      setCurrentPage(0);
      setHasMore(true);
      fetchMaimuList(0, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, access_token]);

  // 무한 스크롤을 위한 Intersection Observer
  useEffect(() => {
    if (!hasMore || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = currentPage + 1;
          if (nextPage < totalPage) {
            fetchMaimuList(nextPage, true);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, currentPage, totalPage, fetchMaimuList]);

  const getBackgroundColor = () => {
    switch (decodedGroupColor) {
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
    <div className="DetailPage" style={{ background: getBackgroundColor() }}>
      <ToastContainer />
      <div className="JustifyCenter">
        <div className="DetailPageScroll">
          <div className="DetailPageContent">
            <header className="DetailHeader">
              <button
                type="button"
                className="DetailBack"
                onClick={() => navigate("/MainPage")}
                aria-label="사물함 목록으로"
              >
                <img src={BackButton} alt="" aria-hidden="true" />
              </button>

              <img className="SmallLogo" alt="MAIMU" src={SmallLogoImg} />

              <button
                type="button"
                className="DetailShare"
                onClick={handleKakaoShare}
                aria-label="초대 링크 공유하기"
              >
                <img src={KakaoIcon} alt="" aria-hidden="true" />
              </button>
            </header>

            <h1 className="GroupName">{decodedGroupName}</h1>
            <p className="DetailCount">
              {maimuList.length > 0
                ? `쪽지 ${maimuList.length}개`
                : "아직 도착한 쪽지가 없어요"}
            </p>

            <div className="DetailMaimu">
              {maimuList.map((maimu) => (
                <DetailMaimu maimu={maimu}
                groupName={groupName} groupColor={groupColor} group_id={group_id} />
              ))}
              {/* 무한 스크롤을 위한 관찰 대상 */}
              {hasMore && (
                <div ref={observerTarget} style={{ width: "100%", height: "20px", gridColumn: "1 / -1" }}>
                  {isLoading && <div style={{ textAlign: "center", padding: "10px" }}>로딩 중...</div>}
                </div>
              )}
            </div>
            {pasteState && <PasteLinkAlert setPasteState={setPasteState} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
