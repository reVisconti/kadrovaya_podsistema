import { Button } from "@mui/material";
import * as React from "react";
import axios from "axios";
import { StatementStatus } from "../../utils/utils";

export function CellButtonShow() {
  return (
    <strong>
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ marginLeft: 16 }}
        onClick={() => {}}
      >
        Посмотреть
      </Button>
    </strong>
  );
}
export function CellButtonRevoked(params) {
  function fetchData() {
    if (params.row.status !== StatementStatus[0]) return;
    axios({
      method: "post",
      url: process.env.REACT_APP_PUBLIC_URL_API + "/api/revokeStatement",
      data: {
        statementID: params.row.id,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }).then((response) => {
      if (response.status === 200) params.row.status = StatementStatus[1];
    });
  }
  return (
    <strong>
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ marginLeft: 16 }}
        onClick={() => {
          fetchData(params);
        }}
      >
        Отозвать
      </Button>
    </strong>
  );
}
