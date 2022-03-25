import React from "react";

interface ColorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  color: string;
  height?: number;
  noSelected?: boolean;
  pointer?: boolean;
  selected?: boolean;
  size: number;
}

const Color = ({
  color,
  height,
  noSelected,
  pointer,
  selected,
  size,
  ...rest
}: ColorProps) => {
  return (
    <div
      style={{
        display: "inline-block",
        cursor: pointer ? "pointer" : "default",
      }}
    >
      <span
        style={{
          backgroundColor: color,
          borderRadius: height ? 6 : 8,
          display: "block",
          height: height ?? size,
          marginRight: 8,
          width: size,
        }}
        {...rest}
      ></span>
      {noSelected ? null : (
        <span
          style={{
            backgroundColor: selected ? "#232323" : "transparent",
            borderRadius: 6,
            display: "block",
            marginLeft: (size + 8) / 2 - 7.5,
            marginTop: 4,
            height: 6,
            width: 6,
          }}
        ></span>
      )}
    </div>
  );
};

Color.defaultProps = {
  size: 40,
};

export default Color;
