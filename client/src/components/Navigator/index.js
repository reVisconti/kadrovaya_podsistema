import * as React from "react";
import { logDOM } from "@testing-library/react";

function Navigator({ removeToken, setTitle, role }) {
  console.log("nav" + role);
  return (
    <div
      className="content"
      style={{
        width: "70%",
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p
        onClick={(event) => setTitle(event.target["textContent"])}
        style={{ cursor: "pointer" }}
      >
        Создать заявление
      </p>
      <p
        onClick={(event) => setTitle(event.target["textContent"])}
        style={{ cursor: "pointer" }}
      >
        Мои заявления
      </p>
      {role === 3 ? (
        <p
          onClick={(event) => setTitle(event.target["textContent"])}
          style={{ cursor: "pointer" }}
        >
          Сотрудники
        </p>
      ) : null}
      {role === 3 ? (
        <p
          onClick={(event) => setTitle(event.target["textContent"])}
          style={{ cursor: "pointer" }}
        >
          Документы
        </p>
      ) : null}
      <p onClick={removeToken} style={{ cursor: "pointer" }}>
        Выйти
      </p>
    </div>
  );
}

export default Navigator;
