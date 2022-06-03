import React from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import type { StoreAppColorInput } from "../../api/types/globalTypes";
import { getContrastColor } from "../../lib/color-contrast";
import { Color, TextField } from "../atoms";

import styles from "./ColorPicker.module.css";

const { Title } = Typography;

type TextColor = "#000" | "#fff";

type ColorInput = { color: string; text: TextColor };

interface ColorPickerProps {
  value?: StoreAppColorInput;
  onChange: (change: ColorInput) => void;
}

const defaultColors = [
  "#EB5757",
  "#F2994A",
  "#F2C94C",
  "#219653",
  "#2F80ED",
  "#56CCF2",
  "#BB6BD9",
];

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const { t } = useTranslation("client");

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={5}>{t("color")}</Title>
        </Col>
        <Col span={24}>
          {defaultColors.length > 0 && (
            <Row>
              {defaultColors.map((color) => (
                <Color
                  color={color}
                  key={color}
                  onClick={() =>
                    onChange({
                      color,
                      text: getContrastColor(color as TextColor),
                    })
                  }
                  pointer
                  selected={color === value?.color ?? defaultColors[0]}
                  size={28}
                />
              ))}
            </Row>
          )}
          <Row>
            <div className={styles.customColorContainer}>
              <TextField
                defaultValue={
                  value?.color?.toLocaleUpperCase() ??
                  defaultColors[0]?.toLocaleUpperCase()
                }
                label={t("client:colorHex")}
                name="name"
                onChange={(e) =>
                  onChange({
                    color: e.target.value?.toLocaleUpperCase(),
                    text: getContrastColor(
                      e.target.value?.toLocaleUpperCase() as TextColor
                    ),
                  })
                }
                rules={[{ required: true }]}
                single
                value={
                  value?.color?.toLocaleUpperCase() ??
                  defaultColors[0]?.toLocaleUpperCase()
                }
                wrapperClassName={styles.customColorInput}
              />
              <Color
                color={value?.color ?? defaultColors[0]}
                noSelected
                height={28}
                size={120}
              />
            </div>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ColorPicker;
