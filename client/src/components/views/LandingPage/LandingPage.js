import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";

function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/users/auth");
      setIsLoggedIn(response.data.isAuth);
    };
    fetchData();
  }, []);

  const logoutHandler = () => {
    axios.get("api/users/logout").then((response) => {
      if (response.data.success) {
        alert("로그아웃되었습니다. 로그인 페이지로 돌아갑니다.");
        navigate("/login");
      } else {
        alert("로그아웃에 실패하였습니다.");
      }
    });
  };

  const loginHandler = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>

      {isLoggedIn == true ? (
        <button onClick={logoutHandler}>Logout</button>
      ) : (
        <button onClick={loginHandler}>Login</button>
      )}
    </div>
  );
}

export default LandingPage;
