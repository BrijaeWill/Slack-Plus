import './message.css';
import { useState, useEffect } from 'react';

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  // Runs when socket event is recieved from the server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setMessagesReceived((state) => {
        const updatedState = [
          ...state,
          {
            message: data.message,
            username: data.username,
            _createdtime_: data._createdtime_,
          },
        ];
        console.log('Updated state:', updatedState);  // Log inside the function after updating state
        return updatedState;
      });
    });

    // Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  return (
    <div className="messages-Column">
      {messagesRecieved.map((msg, i) => (
        <div className="message p-3 mb-3 border rounded" key={i}>
          <div className="d-flex justify-content-between">
            <span className="msg-meta text-info">{msg.username}</span>
            <span className="msg-meta text-muted">
              {formatDateFromTimestamp(msg._createdtime_)}
            </span>
          </div>
          <p className="msg-text">{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;