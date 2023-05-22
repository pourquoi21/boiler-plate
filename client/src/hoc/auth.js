import React from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
// import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
  const dispatch = useDispatch();
  //   let navigate = useNavigate();

  function AuthenticationCheck(props) {
    React.useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // 로그인하지 않은 상태
      });
      //Axios.get("/api/users/auth");
    }, []);
    return <SpecificComponent {...props} />;
  }

  return <AuthenticationCheck />;
}
