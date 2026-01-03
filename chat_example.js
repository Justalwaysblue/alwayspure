export async function sendMessage(content) {
  const apiKey = localStorage.getItem('apiKey');
  const apiUrl = localStorage.getItem('apiUrl');
  const model = localStorage.getItem('model') || 'glm-4.7';

  if (!apiKey) {
    throw new Error('请先在设置中配置 API Key');
  }

  if (!apiUrl) {
    throw new Error('请先在设置中配置 API URL');
  }

  if (!content.trim()) {
    throw new Error('请输入消息内容');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export function initChat() {
  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message-input');
  const contentArea = document.querySelector('.application__content');

  if (!sendButton || !messageInput || !contentArea) {
    return;
  }

  sendButton.addEventListener('click', async () => {
    const content = messageInput.value.trim();
    if (!content) return;

    // 添加用户消息到内容区
    addMessage(contentArea, 'user', content);
    messageInput.value = '';

    // 显示加载状态
    const loadingId = addLoadingIndicator(contentArea);

    try {
      const response = await sendMessage(content);
      removeLoadingIndicator(contentArea, loadingId);
      addMessage(contentArea, 'assistant', response);
    } catch (error) {
      removeLoadingIndicator(contentArea, loadingId);
      addMessage(contentArea, 'error', error.message);
    }
  });

  // 支持 Ctrl+Enter 发送
  messageInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      sendButton.click();
    }
  });
}

function addMessage(container, type, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message--${type}`;

  const label = document.createElement('div');
  label.className = 'message__label';
  label.textContent =
    type === 'user' ? 'You' : type === 'assistant' ? 'AI' : 'Error';

  const text = document.createElement('div');
  text.className = 'message__content';
  text.textContent = content;

  messageDiv.appendChild(label);
  messageDiv.appendChild(text);
  container.appendChild(messageDiv);

  // 滚动到底部
  container.scrollTop = container.scrollHeight;
}

function addLoadingIndicator(container) {
  const id = 'loading-' + Date.now();
  const loadingDiv = document.createElement('div');
  loadingDiv.id = id;
  loadingDiv.className = 'message message--loading';
  loadingDiv.textContent = 'AI 正在思考...';

  container.appendChild(loadingDiv);
  container.scrollTop = container.scrollHeight;

  return id;
}

function removeLoadingIndicator(_container, id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}
