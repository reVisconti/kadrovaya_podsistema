import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Roles } from "../../utils/utils";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function AddUser() {
  const [positions, setPositions] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [fullName, seFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState(0);
  const [userPosition, setUserPosition] = React.useState(null);
  const [director, setDirector] = React.useState(null);
  function addUser() {
    console.log(fullName);
    return new Promise((resolve) => {
      axios
        .post(process.env.REACT_APP_PUBLIC_URL_API + "/api/registration", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          email,
          password,
          fullname: fullName,
          position: userPosition,
          directorID: director,
          roles: role,
        })
        .then((response) => {
          if (response.status === 200) {
            alert("user added");
          }
        });
    });
  }
  function addPosition() {
    let position = document.getElementById("position-input").value;
    console.log(position);
    axios({
      method: "post",
      url: process.env.REACT_APP_PUBLIC_URL_API + "/api/admin/addPosition",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        Accept: "application/json",
      },
      data: {
        position: position,
      },
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        fetchPositions();
      }
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser();
  };
  const InputStyle = {
    height: 50,
    width: 400,
    fontSize: "18pt",
  };
  const OptionSelectStyle = {
    fontSize: "14pt",
  };
  async function fetchManagers() {
    axios({
      method: "get",
      url: process.env.REACT_APP_PUBLIC_URL_API + "/api/admin/managers",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }).then((response) => {
      setManagers(response.data.users);
    });
  }

  async function fetchPositions() {
    axios({
      method: "get",
      url: process.env.REACT_APP_PUBLIC_URL_API + "/api/admin/positions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }).then((response) => {
      setPositions(response.data.positions);
    });
  }
  useEffect(() => {
    fetchPositions();
    fetchManagers();
  }, [positions]);
  return (
    <div style={{ width: 400, display: "flex", marginTop: 40 }}>
      <form onSubmit={handleSubmit}>
        <div className="field-wrap">
          <label htmlFor="full-name-input">ФИО</label>
          <input
            id="full-name-input"
            required
            type="text"
            style={InputStyle}
            onChange={(e) => seFullName(e.target.value)}
          />
        </div>
        <div className="field-wrap">
          <label htmlFor="email-reg-input">Email</label>
          <input
            id="email-reg-input"
            required
            type="text"
            style={InputStyle}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field-wrap">
          <label htmlFor="password-reg-input">Пароль</label>
          <input
            id="password-reg-input"
            required
            type="password"
            style={InputStyle}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field-wrap">
          <label htmlFor="full-name-input">Роль</label>
          <select
            id="role-select"
            style={InputStyle}
            required
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="0" style={OptionSelectStyle}>
              Пользователь
            </option>
            <option value="1" style={OptionSelectStyle}>
              Кадровик
            </option>
            <option value="2" style={OptionSelectStyle}>
              Руководитель
            </option>
            <option value="3" style={OptionSelectStyle}>
              Администратор
            </option>
          </select>
        </div>
        <div className="field-wrap">
          <label htmlFor="full-name-input">Должность</label>
          <select
            id="position-select"
            style={InputStyle}
            required
            onChange={(e) => setUserPosition(e.target.value)}
          >
            {positions.map((position, id) => (
              <option value={position._id}>{position.position}</option>
            ))}
          </select>
        </div>
        <div className="field-wrap">
          <label htmlFor="full-name-input">Руководитель</label>
          <select
            id="position-select"
            style={InputStyle}
            onChange={(e) => setDirector(e.target.value)}
          >
            {managers.map((manager, id) => (
              <option value={manager._id}>{manager.fullName}</option>
            ))}
          </select>
        </div>
        <button className="button" onClick={addUser}>
          Добавить пользователя
        </button>
      </form>
      <div style={{ marginLeft: 30 }}>
        <label htmlFor="position-input">Добавить должность</label>
        <input id="position-input" required type="text" style={InputStyle} />
        <IconButton color="secondary" aria-label="add" onClick={addPosition}>
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default AddUser;
