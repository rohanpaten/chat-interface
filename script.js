document.addEventListener('DOMContentLoaded', () => {
  const chatList = document.getElementById('chat-list');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'sent');
    input.value = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (response.ok) {
        const data = await response.json();
        addMessage(data.reply, 'received');
      } else {
        const err = await response.json();
        addMessage('Error: ' + err.error, 'received');
      }
    } catch (err) {
      addMessage('Network error', 'received');
    }
  });

  function addMessage(text, type) {
    const li = document.createElement('li');
    li.className = `chat-message ${type}`;
    li.textContent = text;
    chatList.appendChild(li);
    chatList.scrollTop = chatList.scrollHeight;
  }
});
