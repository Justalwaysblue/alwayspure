import { Typewriter } from "./Typewriter.js";

export function initChat() {
  const sendButton = document.getElementById("send-button");
  const contentContainer = document.querySelector(".application__content");
  const messageInput = document.getElementById("message-input");
  if (!sendButton || !contentContainer || !messageInput) {
    return;
  }

  sendButton.addEventListener("click", async () => {
    if (!messageInput.value) {
      return;
    }
    addMessage(contentContainer, "User", messageInput.value);
    const messages = [{ role: "user", content: messageInput.value }];
    messageInput.value = "";
    try {
      const response = await callGlm(messages);
      addMessage(contentContainer, "AI", "");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const messageDiv = contentContainer.lastElementChild.querySelector(
        ".message__content-left"
      );
      const typewriter = new Typewriter(100, (text) => {
        messageDiv.textContent += text;
        contentContainer.scrollTop = contentContainer.scrollHeight;
      });
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && !line.endsWith("[DONE]")) {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              throw new Error(data.error);
            }

            const content = data?.choices[0]?.delta?.content;
            if (content) {
              typewriter.push(content);
              typewriter.start();
            }
          }
        }
      }
    } catch (e) {
      console.error("Error", e);
    }
  });
}

function addMessage(container, type, content) {
  const bfc = document.createElement("div");
  bfc.style = "overflow: hidden";
  const messageDiv = document.createElement("div");

  messageDiv.className =
    type === "User" ? "message__content-right" : "message__content-left";
  messageDiv.textContent = content;

  bfc.appendChild(messageDiv);
  container.appendChild(bfc);

  container.scrollTop = container.scrollHeight;
}

async function callGlm(messages, model = "glm-4.7") {
  const url = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  const apiKey = localStorage.getItem("apiKey");

  if (!apiKey) {
    throw new Error(
      "API Key not configured. Please click Settings to configure."
    );
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 1.0,
      stream: true,
      thinking: { type: "disabled", clear_thinking: true },
    }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response;
}
