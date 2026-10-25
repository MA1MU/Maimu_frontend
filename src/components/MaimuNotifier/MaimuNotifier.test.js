import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TextDecoder, TextEncoder } from "util";
import MaimuNotifier from "./MaimuNotifier";
import readEvents from "./readEvents";

jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("../../api/api", () => ({ baseUrl: "https://apimaimu.co.kr" }));

global.TextDecoder = TextDecoder;
const encoder = new TextEncoder();

function stream(chunks) {
  const reader = {
    read: jest.fn(),
    releaseLock: jest.fn(),
  };
  chunks.forEach((value) => reader.read.mockResolvedValueOnce({ value, done: false }));
  reader.read.mockResolvedValue({ done: true });
  return { getReader: () => reader };
}

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

test("한글 바이트와 CRLF 경계가 청크 사이에 나뉘어도 이벤트를 수신한다", async () => {
  const bytes = encoder.encode('event:maimu\r\ndata:{"groupName":"사물함"}\r\n\r\n');
  const chunks = Array.from(bytes, (byte) => new Uint8Array([byte]));
  const onEvent = jest.fn();
  await readEvents(stream(chunks), onEvent);
  expect(onEvent).toHaveBeenCalledTimes(1);
  expect(onEvent).toHaveBeenCalledWith("maimu", '{"groupName":"사물함"}');
});

test("heartbeat를 건너뛰고 LF로 구분된 여러 이벤트를 수신한다", async () => {
  const onEvent = jest.fn();
  await readEvents(stream([encoder.encode(':ping\n\nevent:connect\ndata:connected\n\nevent:maimu\ndata:{"count":1}\n\n')]), onEvent);
  expect(onEvent.mock.calls).toEqual([["connect", "connected"], ["maimu", '{"count":1}']]);
});

test("SSE 수신 시 실제 토스트와 갱신 이벤트를 만들고 화면 레이아웃 밖에 표시한다", async () => {
  localStorage.setItem("access_token", "test-token");
  const onNewMaimu = jest.fn();
  window.addEventListener("maimu:new", onNewMaimu);
  let deliver;
  const reader = {
    read: jest.fn().mockImplementationOnce(() => new Promise((resolve) => { deliver = resolve; }))
      .mockImplementation(() => new Promise(() => {})),
    releaseLock: jest.fn(),
  };
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({ ok: true, body: { getReader: () => reader } });
  const { container, unmount } = render(
    <MemoryRouter><div className="Frame"><MaimuNotifier /><main>사물함 화면</main></div></MemoryRouter>
  );
  try {
    await waitFor(() => expect(deliver).toBeDefined());
    await act(async () => {
      deliver({ value: encoder.encode('event:maimu\ndata:{"groupId":1,"groupName":"테스트","groupColor":"핑크","count":1}\n\n'), done: false });
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("새 마이무 1개가 도착했어요!");
    expect(container.querySelector(".Toastify")).toBeNull();
    expect(document.body.querySelector("#maimu-notifier").parentElement).toBe(document.body);
    expect(onNewMaimu).toHaveBeenCalledTimes(1);
    expect(onNewMaimu.mock.calls[0][0].detail).toEqual({ groupId: 1 });
  } finally {
    unmount();
    window.removeEventListener("maimu:new", onNewMaimu);
    global.fetch = originalFetch;
  }
});
