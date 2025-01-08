// client/src/pages/chat/index.js

import './message.css';
import MessagesReceived from './messages';

const Chat = ({ socket }) => {
  return (
    <div className="container">
      <div>
        <MessagesReceived socket={socket} />
      </div>
    </div>
  );
};

export default Chat;