import React from "react";
import axios from "axios";

function LandingPage() {
  React.useEffect(() => {
    axios.get("/api/hello").then((res) => console.log(res.data));
  }, []);
  return <div>LandingPage</div>;
}

export default LandingPage;
