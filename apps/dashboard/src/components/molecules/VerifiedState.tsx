import React from "react";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

interface VerifiedStateProps {
  verified?: boolean | null;
}

const VerifiedState = ({ verified }: VerifiedStateProps) => {
  return verified ? (
    <CheckCircleTwoTone twoToneColor="#27c272" />
  ) : (
    <CloseCircleTwoTone twoToneColor="#e72e2e" />
  );
};

export default VerifiedState;
