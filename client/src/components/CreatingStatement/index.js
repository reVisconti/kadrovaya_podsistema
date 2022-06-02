import React from "react";
import moment from "moment";
import axios from "axios";

function CreatingStatement() {
  const [statementType, setStatementType] = React.useState(0);
  const [dayCount, setDayCount] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [dateFollowedWorkDate, setDateFollowedWorkDate] = React.useState(null);
  const [placeStatement, setPlaceStatement] = React.useState(null);

  const InputStyle = {
    height: 50,
    width: 400,
  };
  const OptionSelectStyle = {
    fontSize: "13pt",
  };

  function sendStatement() {
    return new Promise((resolve) => {
      console.log(placeStatement);
      axios({
        method: "post",
        url: process.env.REACT_APP_PUBLIC_URL_API + "/api/createStatement",
        data: {
          type: statementType,
          countDay: dayCount,
          dateFollowedWork: dateFollowedWorkDate,
          vacationSpot: placeStatement,
          startDate,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          Accept: "application/json",
        },
      }).then((response) => {
        console.log(response);
        resolve();
      });
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendStatement();
  };
  return (
    <div style={{ width: 400, display: "flex", marginTop: 40 }}>
      <form onSubmit={handleSubmit}>
        <div className="field-wrap">
          <label htmlFor="statementSelect">Выбор типа заявления</label>
          <select
            id="statementSelect"
            name="statementSelect"
            style={InputStyle}
            onChange={(e) => setStatementType(e.target.value)}
          >
            <option value="0" style={OptionSelectStyle}>
              Заявление на ежегодный оплачиваемый отпуск
            </option>
            <option value="1" style={OptionSelectStyle}>
              Заявление на отпуск без сохранения заработной платы
            </option>
            <option value="2" style={OptionSelectStyle}>
              Заявление на отгул в счет отработанного ранее времени
            </option>
            <option value="3" style={OptionSelectStyle}>
              Заявление на отгул с последующей отработкой
            </option>
          </select>
        </div>
        <div className="field-wrap">
          <label htmlFor="day-count-input">Количество дней отпуска</label>
          <input
            id="day-count-input"
            type="number"
            required
            min={1}
            style={InputStyle}
            autoComplete="off"
            onChange={(e) => setDayCount(e.target.value)}
          />
        </div>
        <div className="field-wrap">
          <label htmlFor="start-date-input">Начальная дата отпуска</label>
          <input
            id="start-date-input"
            type="date"
            required
            min={moment(Date.now()).format("YYYY-MM-DD")}
            onChange={(e) => setStartDate(e.target.value)}
            style={InputStyle}
            autoComplete="off"
          />
        </div>
        <div className="field-wrap">
          <label htmlFor="date-followed-work-input">Дата отработки</label>
          <input
            id="date-followed-work-input"
            type="date"
            min={moment(Date.now()).format("YYYY-MM-DD")}
            style={InputStyle}
            required={statementType === "3" || statementType === "2"}
            autoComplete="off"
            onChange={(e) => setDateFollowedWorkDate(e.target.value)}
          />
        </div>
        <div className="field-wrap">
          <label htmlFor="date-followed-work-input">
            Место проведения отпуска
          </label>
          <input
            id="place-input"
            type="text"
            style={InputStyle}
            required={statementType !== "3" && statementType !== "2"}
            autoComplete="off"
            onChange={(e) => setPlaceStatement(e.target.value)}
          />
        </div>
        <button className="button">Отправить заявление</button>
      </form>
    </div>
  );
}
export default CreatingStatement;
