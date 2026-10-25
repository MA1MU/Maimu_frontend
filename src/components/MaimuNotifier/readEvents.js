// 네트워크 청크와 SSE 이벤트 경계는 다르므로 완성된 이벤트만 전달한다.
export default async function readEvents(body, onEvent) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return;
      buffer += decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const block = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        let name = "message";
        const data = [];
        block.split(/\r?\n/).forEach((line) => {
          if (line.startsWith("event:")) name = line.slice(6).trim();
          else if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /, ""));
        });
        if (data.length) onEvent(name, data.join("\n"));
      }
    }
  } finally {
    reader.releaseLock();
  }
}
