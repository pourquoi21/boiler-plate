import React from "react";
import axios from "axios";

function LandingPage() {
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/api/hello")
      .then((res) => console.log(res.data));
  }, []);
  return <div>LandingPage</div>;
}

export default LandingPage;
