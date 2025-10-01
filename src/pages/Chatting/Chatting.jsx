import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Chatting.css';
import SendIcon from '../../assets/AiButton.svg';

const Chatting = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const userCommand = location.state?.userCommand;

  useEffect(() => {
    if (userCommand) {
      sendToServer(userCommand);
      setMessage('');
    }
  }, [userCommand]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const sendToServer = async (msg) => {
    const userMsg = { sender: 'user', text: msg };
    setChatHistory((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: msg }),
      });

      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.answer || '응답 없음' };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { sender: 'bot', text: '서버 연결에 실패했습니다.' };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendToServer(message);
    setMessage('');
  };

  return (
        <div className="chat-layout">
          <div className="chat-area">
            {chatHistory.map((msg, index) =>
              msg.sender === 'user' ? (
                <div className="user-message" key={index}>
                  <div className="message-bubble user-bubble">{msg.text}</div>
                </div>
              ) : (
                <div className="AI-message" key={index}>
                  <img className="AI-icon" src={SendIcon} alt="AI" />
                  <div className="message-bubble ai-bubble">{msg.text}</div>
                </div>
              )
            )}
            {loading && (
              <div className="AI-message">
                <img className="AI-icon" src={SendIcon} alt="AI" />
                <div className="message-bubble ai-bubble">답변 생성 중...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area">
            <input
              className="chat-input"
              type="text"
              placeholder="무엇이든 물어보세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <img
              className="send-icon"
              src={SendIcon}
              alt="send"
              onClick={handleSend}
            />
          </div>
        </div>
  );
};

export default Chatting;
