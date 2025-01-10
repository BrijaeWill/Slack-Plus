import './message.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

  const leaveRoom = () => {
    const _createdtime_ = Date.now();
    socket.emit('leave_room', { username, room, _createdtime_});
    
    // Redirect to home page

    navigate('/', { replace: true });
  };

  return (
    <div className="room-users-column p-3">
      <h2 className="room-title">{room}</h2>
  
      <div>
        {roomUsers.length > 0 && <h5 className="users-title">Users:</h5>}
        <ul className="users-list">
          {roomUsers.map((user) => (
            <li
              className={`user-item ${
                user.username === username ? 'font-weight-bold' : ''
              }`}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
  
      <button className="btn btn-outline-danger leave-room-btn" onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
}

export default RoomAndUsers;