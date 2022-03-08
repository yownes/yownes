import React from "react";

import { NewLogo } from "../components/atoms";
import { Tos as TosComponent } from "../components/molecules";

const Tos = () => {
  return (
    <div>
      <div style={{ paddingTop: "1rem", textAlign: "center" }}>
        <NewLogo />
      </div>
      <div style={{ padding: "1rem" }}>
        <TosComponent />
      </div>
    </div>
  );
};

export default Tos;
