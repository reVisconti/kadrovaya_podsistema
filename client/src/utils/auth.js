import * as React from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    return tokenString ? tokenString : null;
  };

  const [token, setToken] = React.useState(getToken());

  const saveToken = (userToken) => {
    sessionStorage.setItem("token", userToken);
    setToken(userToken);
  };

  const removeToken = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    console.log("do");
  };
  return {
    setToken: saveToken,
    removeToken: removeToken,
    token,
  };
}
