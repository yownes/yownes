import React from "react";
import { Input, Radio, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { StoreAppColorInput } from "../../api/types/globalTypes";

import { Color } from "../atoms";

const { Title, Paragraph } = Typography;

type TextColor = "white" | "black";

type ColorInput = { color: string; text: TextColor };

interface ColorPickerProps {
  value?: StoreAppColorInput;
  onChange: (change: ColorInput) => void;
}

const defaultColors = ["#AF43BE", "#FD8090", "#C4FFFF", "#08DEEA", "#1261D1"];

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const { t } = useTranslation("client");
  return (
    <div>
      <Title level={4}>{t("color")}</Title>

      <Paragraph>{t("colorPalette")}</Paragraph>
      <div style={{ display: "flex", gap: 15 }}>
        {defaultColors.map((color) => (
          <Color
            color={color}
            key={color}
            onClick={() =>
              onChange({ color, text: (value?.text as TextColor) ?? "white" })
            }
            size={20}
          />
        ))}
      </div>

      <Paragraph>{t("selectedColor")}</Paragraph>

      <Input
        placeholder="#333333"
        style={{ width: 150 }}
        value={value?.color ?? defaultColors[0]}
        onChange={(e) =>
          onChange({
            color: e.target.value,
            text: (value?.text as TextColor) ?? "white",
          })
        }
      />
      <div>
        <Color color={value?.color ?? defaultColors[0]} size={80}></Color>
      </div>
      <Paragraph>{t("textColor")}</Paragraph>
      <Radio.Group
        name="text"
        value={value?.text ?? "white"}
        onChange={(e) => {
          onChange({
            color: value?.color ?? defaultColors[0],
            text: e.target.value,
          });
        }}
      >
        <Radio value="white">
          <span
            style={{
              backgroundColor: value?.color ?? undefined,
              color: "white",
              padding: "1rem",
            }}
          >
            {t("white")}
          </span>
        </Radio>
        <Radio value="black">
          <span
            style={{
              backgroundColor: value?.color ?? undefined,
              color: "black",
              padding: "1rem",
            }}
          >
            {t("black")}
          </span>
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default ColorPicker;
