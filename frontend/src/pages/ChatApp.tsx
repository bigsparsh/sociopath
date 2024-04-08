import { hc } from "hono/client";
const ChatApp = () => {
  const client = hc("http://localhost:8787");
  const ws = client.ws.$ws(0);

  ws.addEventListener("open", () => {
    setInterval(() => {
      ws.send(new Date().toString());
    }, 1000);
  });
  return "This is chat app";
};
export default ChatApp;
