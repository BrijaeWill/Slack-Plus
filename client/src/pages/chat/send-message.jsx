import React, { useState } from 'react';
import './message.css';
const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message !== '') {
      const __createdtime__ = Date.now();
      // Send message to server, which then redirects to the end recipient.
      socket.emit('send_message', { username, room, message, __createdtime__ });
      setMessage('');
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 send-message-container">
      <input
        className="form-control me-3 message-input"
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button
        className="btn btn-primary send-message-btn"
        onClick={sendMessage}
      >
        Send Message
      </button>
    </div>
  );
}  
export default SendMessage;