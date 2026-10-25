import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../../api/api";
import "./MaimuNotifier.css";
import readEvents from "./readEvents";

// 로그인한 사용자가 앱을 보고 있는 동안 새 마이무 도착을 실시간(SSE)으로 알려준다.
// EventSource 는 Authorization 헤더를 실을 수 없어서 fetch 스트림을 직접 읽는다.
const CONTAINER_ID = "maimu-notifier"; // 페이지별 ToastContainer 와 섞이지 않게 분리
const RETRY_MS = 3000;
const AUTH_RETRY_MS = 30000;

const MaimuNotifier = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    let timer;

    const onEvent = (name, data) => {
      if (name !== "maimu") return;
      let notification;
      try {
        notification = JSON.parse(data);
      } catch {
        console.warn("새 마이무 알림 형식이 올바르지 않습니다.");
        return;
      }
      const { groupId, groupName, groupColor, count } = notification;
      // 사물함 화면(MainPage)이 안 읽은 개수를 다시 불러오도록 알린다
      window.dispatchEvent(new CustomEvent("maimu:new", { detail: { groupId } }));
      toast(`💌 '${groupName}' 사물함에 새 마이무 ${count}개가 도착했어요!`, {
        containerId: CONTAINER_ID,
        className: "MaimuNotifier_Toast",
        autoClose: 4000,
        hideProgressBar: true,
        onClick: () =>
          navigate(`/DetailPage/${encodeURI(groupName)}/${encodeURI(groupColor)}/${groupId}`),
      });
    };

    const connect = async () => {
      let delay = RETRY_MS;
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const res = await fetch(`${api.baseUrl}/v1/api/notification/subscribe`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
            signal: controller.signal,
          });
          if (res.ok && res.body) {
            await readEvents(res.body, onEvent); // 서버가 연결을 닫으면(타임아웃) 반환 → 재연결
          } else {
            const error = await res.json().catch(() => ({}));
            if (error.code === "T-003") {
              // 만료된 액세스 토큰: 다른 API 와 같은 방식으로 재발급 후 바로 재연결
              const reissued = await axios.post(`${api.baseUrl}/v1/api/auth/reissue`, {}, { withCredentials: true });
              localStorage.setItem("access_token", reissued.data.accessToken);
              delay = 0;
            } else {
              console.warn("실시간 알림 연결에 실패했습니다.", res.status);
              delay = AUTH_RETRY_MS;
            }
          }
        } catch (e) {
          if (controller.signal.aborted) return;
          console.warn("실시간 알림 연결이 끊겨 다시 연결합니다.");
        }
      }
      // 로그아웃 상태면 토큰이 생길 때까지 가볍게 다시 확인한다(네트워크 요청 없음)
      if (!controller.signal.aborted) timer = setTimeout(connect, delay);
    };

    connect();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [navigate]);

  // .Frame > * 의 min-height: 100% 및 스크롤 영역과 분리한다.
  return createPortal(
    <ToastContainer containerId={CONTAINER_ID} position="top-center" limit={3} />,
    document.body
  );
};

export default MaimuNotifier;
