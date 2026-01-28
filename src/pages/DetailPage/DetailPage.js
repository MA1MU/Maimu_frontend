import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PasteLinkAlert } from "../../components/PasteLinkAlert/PasteLinkAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../../api/api";
import ClipboardJS from "clipboard";
import "./DetailPage.css";
import "../../components/PasteLinkAlert/PasteLinkAlert.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import PasteLink from "../../images/DetailPage/PasteLink.svg";
import DetailMaimu from "../../components/DetailMaimu/DetailMaimu";

const DetailPage = () => {
  const navigate = useNavigate();
  const [pasteState, setPasteState] = useState(false);
  const { groupName, groupColor, group_id } = useParams();
  
  // 마이무 목록 상태
  const [maimuList, setMaimuList] = useState([]);
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
      const { data, currentPage: responseCurrentPage, totalPage: responseTotalPage } = response.data;
      
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


  // 버튼을 참조할 Ref 생성
  const copyBtnRef = useRef(null);

  // ClipboardJS 설정 (iOS 대응 핵심)
  useEffect(() => {
    if (!copyBtnRef.current || !groupId || !access_token) return;

    // ClipboardJS는 클릭하는 '순간' 이벤트를 가로채서 유지합니다.
    const clipboard = new ClipboardJS(copyBtnRef.current, {
      text: async () => {
        try {
          // 클릭 직후 비동기 통신 시작
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
          console.log("token 값: ", response.data);
          console.log("window.location.origin: ", window.location.origin);
          const token = response.data;
          // 리턴값이 클립보드에 복사될 텍스트가 됩니다.
          return `${window.location.origin}/WriteDetailPage/${token}`;
        } catch (error) {
          console.error("Error creating invite link:", error);
          const errorMessage = error.response?.data?.message || "링크를 생성하는 중 오류가 발생했습니다.";
          toast.error(errorMessage, {
            autoClose: 3000,
            hideProgressBar: true,
          });
          throw error; // 에러 발생 시 success로 가지 않도록 던짐
        }
      },
    });

    clipboard.on("success", (e) => {
      setPasteState(true);
      e.clearSelection(); // 텍스트 선택 잔상 제거
    });

    clipboard.on("error", (e) => {
      // 위 text 함수에서 throw error가 발생하거나 복사가 불가능할 때 실행
      console.error("복사 실패:", e);
    });

    return () => {
      clipboard.destroy(); // 컴포넌트 언마운트 시 클린업
    };
  }, [groupId, access_token, decodedGroupName]);


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
            <img className="SmallLogo" alt="" src={SmallLogoImg} onClick={() => navigate("/MainPage")} />
            <div className="GroupName">{decodedGroupName}</div>
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
      <img 
        ref={copyBtnRef}
        className="PasteLink" 
        alt="PasteLink" 
        src={PasteLink} 
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default DetailPage;
