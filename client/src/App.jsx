import './App.css'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Home from './pages/home';

const socket = io.connect('http://localhost:4000');
function App() {
  const [username, Setusername] = useState('');
  const [room, SetRoom] = useState('');
  return(
    <Router>
      <div className='App'>
        <Routes>
          <Route 
            path='/' 
            element={
              <Home
                username={username}
                serUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
