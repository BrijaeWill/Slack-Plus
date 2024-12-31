import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () =>{
    return(
    <div className ="container d-flex justify-content align-items-center min-vh-100">
        <div className="form-container border p-4 rounded">
            <h1 className="text-center mb-4">DevRooms</h1>
            <input className="form-control mb-3" placeholder='Username...'>
            </input>

            <select className="form-select mb-3">
                <option>--- Select Room --</option>
                <option value='coders'>The Coders lair</option>
                <option value='laugh'>ComedyRoom</option>
                <option value='chat'>Freedom of Chat</option>
                <option value='silly'>Dont be serious have fun</option>
                <option value='ai'>AI chat room</option>
            </select>
            <button className="btn btn-primary w-100"> Join Room</button>
        </div>
    </div>

    );
}
export default Home;