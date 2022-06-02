import * as React from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { CellButtonRevoked, CellButtonShow } from "../CellButton";
import { StatementStatus, StatementType } from "../../utils/utils";
import moment from "moment";

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
    field: "type",
    headerName: "Вид заявления",
    width: 300,
    editable: true,
  },
  {
    field: "status",
    headerName: "Статус заявления",
    width: 200,
    editable: true,
  },
  {
    field: "startDate",
    headerName: "День начала",
    width: 150,
    editable: true,
  },
  {
    field: "countDay",
    headerName: "Количество дней",
    width: 150,
    editable: true,
  },
  {
    field: "dateFollowedWork",
    headerName: "Дата отработки",
    width: 150,
    editable: true,
  },
  {
    field: "vacationSpot",
    headerName: "Место Отпуска",
    width: 150,
    editable: true,
  },
];

function DocumentList() {
  const [rows, setRows] = React.useState([]);
  async function fetchData() {
    axios({
      method: "get",
      url: process.env.REACT_APP_PUBLIC_URL_API + "/api/admin/documents",
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
          name: statement.name,
          status: StatementStatus[statement.status],
          type: StatementType[statement.type],
          startDate: moment(statement.startDate * 1000).format("YYYY-MM-DD"),
          countDay: statement.countDay,
          dateFollowedWork: statement.dateFollowedWork
            ? moment(statement.dateFollowedWork * 1000).format("YYYY-MM-DD")
            : null,
          vacationSpot: statement.vacationSpot,
        });
      });
      setRows(result);
    });
  }
  useEffect(() => {
    fetchData();
  }, [rows]);
  fetchData();
  return (
    <div style={{ width: 1600, marginTop: 40 }}>
      <DataGrid rows={rows} columns={columns} style={{ color: "white" }} />
    </div>
  );
}

export default DocumentList;
