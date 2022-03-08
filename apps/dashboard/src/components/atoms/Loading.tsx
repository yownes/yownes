import React from "react";
import { Spin } from "antd";

const Loading = () => {
  return (
    <div>
      <Spin style={{ height: "100%", margin: "auto", width: "100%" }} />
    </div>
  );
};

export default Loading;
