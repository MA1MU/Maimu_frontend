import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { PasteLinkAlert } from "../../components/PasteLinkAlert/PasteLinkAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../../api/api";

import "./DetailPage.css";
import "../../components/PasteLinkAlert/PasteLinkAlert.css";
import SmallLogoImg from "../../images/SmallLogo.svg";
import PasteLink from "../../images/DetailPage/PasteLink.svg";
import DetailMaimu from "../../components/DetailMaimu/DetailMaimu";

const DetailPage = () => {
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

      console.log("백엔드 응답:", response.data);
      
      // PageMaimuResponse 구조: { data, currentPage, totalPage }
      const { data, currentPage: responseCurrentPage, totalPage: responseTotalPage } = response.data;
      
      console.log("마이무 목록:", data);
      console.log("현재 페이지:", responseCurrentPage);
      console.log("전체 페이지:", responseTotalPage);
      
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
      <div className="JustifyCenter">
        <div className="DetailPageScroll">
          <div className="DetailPageContent">
            <img className="SmallLogo" alt="" src={SmallLogoImg} />
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
      <img className="PasteLink" alt="PasteLink" src={PasteLink}
              onClick={() => setPasteState(true)}
            />
    </div>
  );
};

export default DetailPage;
