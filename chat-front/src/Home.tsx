import {useState} from "react";
import "./Home.css";
import {postRequest} from "./client";
import {useNavigate} from "react-router-dom";

function App() {
  const [user, setUser] = useState({name: "", surname: ""});
  const navigate = useNavigate();

  const createUserChatRoom = async (user: {name: string; surname: string}) => {
    postRequest("http://localhost:3000/user", user).then((result) => {
      // To fix: type
      navigate(`chat/${(result as {id: string}).id}`);
    });
  };
  return (
    <>
      <div>
        <div>
          <input
            placeholder="name"
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})}
          ></input>
        </div>
        <div>
          <input
            placeholder="surname"
            value={user.surname}
            onChange={(e) => setUser({...user, surname: e.target.value})}
          ></input>
        </div>
        <button
          disabled={user.name === "" || user.surname === ""}
          onClick={() => createUserChatRoom(user)}
        >
          Create Chat Room
        </button>
      </div>
    </>
  );
}

export default App;
