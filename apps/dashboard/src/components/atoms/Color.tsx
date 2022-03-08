import React from "react";

interface ColorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  color: string;
  size?: number;
}

const Color = ({ color, size, ...rest }: ColorProps) => {
  return (
    <span
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        display: "inline-block",
      }}
      {...rest}
    ></span>
  );
};

Color.defaultProps = {
  size: 40,
};

export default Color;
