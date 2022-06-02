import React, { useEffect, useState } from "react";
import axios from "axios";

async function auth(email, password) {
  console.log(email, password);
  if (email === "") {
    alert("Введите почту");
    return;
  }
  if (password === "") {
    alert("Введите пароль");
    return;
  }
  return new Promise((resolve) => {
    axios
      .post(process.env.REACT_APP_PUBLIC_URL_API + "/api/auth", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        email,
        password,
      })
      .then((response) => {
        resolve(response.data.token);
      });
  });
}
function LoginPanel({ setToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    auth(email, password).then((token) => {
      if (token != null) {
        setToken(token);
      }
    });
  };
  return (
    <div className="form content">
      <div id="login">
        <h1>Добро пожаловать!</h1>
        <form onSubmit={handleSubmit}>
          <div className="field-wrap">
            <input
              id="email-input"
              placeholder="Электронный адресс почты"
              type="email"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-wrap">
            <input
              id="password-input"
              placeholder="Пароль"
              type="password"
              required
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="button button-block">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPanel;
