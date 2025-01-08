import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './home.css'
const Home = ({ username, setUsername, room, setRoom, socket }) => {
    const navigate = useNavigate();

    //join room

    const joinRoom = () =>{
        if(room !=='' && username !==''){
            socket.emit('join_room',{username,room});
            navigate('/chat',{replace:true})
        }else{
        alert('Please enter a username and select a room')

        }
    }
    return (
      <div className="container">
        <div className="form-container border p-4 rounded">
          <h1 className="text-center mb-4">DevRooms</h1>
          
          {/* Controlled Input for Username */}
          <input
            className="form-control mb-3"
            placeholder="Username..."
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
  
          {/* Controlled Select for Room */}
          <select
            className="form-select mb-3"
            value={room}
            onChange={(e) => setRoom(e.target.value)} 
          >
            <option value="">--- Select Room ---</option>
            <option value="coders">The Coders Lair</option>
            <option value="laugh">Comedy Room</option>
            <option value="chat">Freedom of Chat</option>
            <option value="silly">Don't Be Serious, Have Fun</option>
            <option value="ai">AI Chat Room</option>
          </select>
  
          {/* Join Room Button */}
          <button
            className="btn btn-pri  mary w-100"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  };
  
  export default Home;
  