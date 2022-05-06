import React from "react";
import { Spin } from "antd";

import { colors } from "../../lib/colors";

interface LoadingFullScreenProps {
  tip: string;
}

const LoadingFullScreen = ({ tip }: LoadingFullScreenProps) => {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        width: "100%",
        zIndex: 9999,
      }}
    >
      <Spin
        style={{ color: colors.green, fontWeight: 500 }}
        size="large"
        tip={tip}
      />
    </div>
  );
};

export default LoadingFullScreen;
