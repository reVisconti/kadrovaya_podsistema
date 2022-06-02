import * as React from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { CellButtonRevoked, CellButtonShow } from "../CellButton";
import { Roles, StatementStatus, StatementType } from "../../utils/utils";
import moment from "moment";
import AddUser from "../addUserForm";

const columns = [
  {
    field: "id",
    headerName: "id",
    width: 180,
  },
  {
    field: "name",
    headerName: "ФИО",
    width: 250,
    editable: true,
  },
  {
    field: "position",
    headerName: "Должность",
    width: 300,
    editable: true,
  },
  {
    field: "role",
    headerName: "Роль",
    width: 300,
    editable: true,
  },
  {
    field: "director",
    headerName: "Директор",
    width: 300,
    editable: true,
  },
];

function UserList() {
  const [rows, setRows] = React.useState([]);
  const [users, setUsers] = React.useState(true);
  useEffect(() => {
    async function fetchData() {
      axios({
        method: "get",
        url: process.env.REACT_APP_PUBLIC_URL_API + "/api/admin/users",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          Accept: "application/json",
        },
      }).then((response) => {
        let result = [];
        response.data.users.forEach((user) => {
          result.push({
            id: user._id,
            name: user.fullName,
            position: user.position,
            role: Roles[user.role],
            director: user.director,
          });
        });
        setRows(result);
      });
    }
    fetchData();
  }, [rows]);
  function handlerChange() {
    let button = document.getElementById("swapDatagridButton");
    if (users) {
      button.innerText = "Список пользователей";
    } else {
      button.innerText = "Добавить сотрудника";
    }
    setUsers(!users);
  }
  return (
    <div style={{ width: 1600, marginTop: 40 }}>
      <button
        className="button"
        id="swapDatagridButton"
        onClick={handlerChange}
        style={{ fontSize: 20, padding: 10 }}
      >
        Добавить сотрудника
      </button>
      {users ? (
        <DataGrid rows={rows} columns={columns} style={{ color: "white" }} />
      ) : (
        <AddUser />
      )}
    </div>
  );
}

export default UserList;
