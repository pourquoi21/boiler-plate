import React from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

export default function Auth({ children, option, adminRoute = null }) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(auth()).then((response) => {
      console.log(response);

      // 로그인하지 않은 상태
      if (!response.payload.isAuth) {
        if (option) {
          navigate("/login");
        }
      } else {
        // 로그인 한 상태
        if (adminRoute && !response.payload.isAdmin) {
          navigate("/");
        } else {
          if (option === false) {
            navigate("/");
          }
        }
      }
    });
    //Axios.get("/api/users/auth");
  }, []);

  return <>{children}</>;
}
