import * as React from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { CellButtonRevoked, CellButtonShow } from "../CellButton";
import { StatementStatus, StatementType } from "../../utils/utils";

const columns = [
  {
    field: "id",
    headerName: "id",
    width: 200,
  },
  {
    field: "type",
    headerName: "Вид заявления",
    width: 300,
  },
  {
    field: "status",
    headerName: "Статус заявления",
    width: 200,
  },
  {
    field: "show",
    headerName: "",
    width: 200,
    renderCell: CellButtonShow,
  },
  {
    field: "revoke",
    headerName: "",
    width: 200,
    renderCell: CellButtonRevoked,
  },
];

function StatementList() {
  const [rows, setRows] = React.useState([]);
  useEffect(() => {
    async function fetchData() {
      axios({
        method: "get",
        url: process.env.REACT_APP_PUBLIC_URL_API + "/api/statements",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          Accept: "application/json",
        },
      }).then((response) => {
        let result = [];
        response.data.statements.forEach((statement) => {
          result.push({
            id: statement._id,
            status: StatementStatus[statement.status],
            type: StatementType[statement.type],
          });
        });
        setRows(result);
      });
    }
    fetchData();
  }, [rows]);
  return (
    <div style={{ width: 1100, marginTop: 40 }}>
      <DataGrid rows={rows} columns={columns} style={{ color: "white" }} />
    </div>
  );
}

export default StatementList;
