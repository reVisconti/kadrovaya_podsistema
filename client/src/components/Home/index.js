import React, { useEffect } from "react";
import Navigator from "../Navigator";
import CreatingStatement from "../CreatingStatement";
import StatementList from "../StatementList";
import axios from "axios";
import DocumentList from "../DocumentList";
import UserList from "../UserList";

function Home({ removeToken }) {
  const [title, setTitle] = React.useState("Мои заявления");
  const [load, setLoad] = React.useState(false);
  const [role, setRole] = React.useState(0);

  useEffect(() => {
    async function fetchRole() {
      return axios({
        method: "post",
        url: process.env.REACT_APP_PUBLIC_URL_API + "/api/role",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          Accept: "application/json",
        },
      }).then((response) => response.data);
    }
    fetchRole().then((res) => {
      setRole(res.role);
      setLoad(true);
      console.log(role);
    });
  }, [load]);

  return (
    <div>
      {load ? (
        <div>
          <Navigator
            removeToken={removeToken}
            setTitle={setTitle}
            role={role}
          />
          <h1 style={{ color: "rgba(19, 35, 47, 0.9)", fontSize: 60 }}>
            {title}
          </h1>
          <div
            className="content"
            style={{
              width: "70%",
              height: 1000,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {title === "Создать заявление" ? <CreatingStatement /> : null}
            {title === "Мои заявления" ? <StatementList /> : null}
            {title === "Документы" ? <DocumentList /> : null}
            {title === "Сотрудники" ? <UserList /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Home;
