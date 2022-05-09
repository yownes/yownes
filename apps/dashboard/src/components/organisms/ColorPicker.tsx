import React from "react";
import { Col, Radio, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import type { StoreAppColorInput } from "../../api/types/globalTypes";
import { Color, TextField } from "../atoms";

import styles from "./ColorPicker.module.css";

const { Text, Title } = Typography;

type TextColor = "white" | "black";

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
          <Row>
            {defaultColors.map((color) => (
              <Color
                color={color}
                key={color}
                onClick={() =>
                  onChange({
                    color,
                    text: (value?.text as TextColor) ?? "white",
                  })
                }
                pointer
                selected={color === value?.color ?? defaultColors[0]}
                size={28}
              />
            ))}
          </Row>
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
                    text: (value?.text as TextColor) ?? "white",
                  })
                }
                rules={[{ required: true }]}
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
        <Col span={24}>
          <Text type="secondary">{t("appColorMessage")}</Text>
        </Col>
        <Col span={24}>
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
            <Row>
              <Radio value="white">
                <div
                  className={styles.textColor}
                  style={{
                    backgroundColor: value?.color ?? undefined,
                    color: "white",
                    marginBottom: 8,
                  }}
                >
                  <span className={styles.textColorText}>{t("white")}</span>
                </div>
              </Radio>
            </Row>
            <Row>
              <Radio value="black">
                <div
                  className={styles.textColor}
                  style={{
                    backgroundColor: value?.color ?? undefined,
                    color: "black",
                  }}
                >
                  <span className={styles.textColorText}>{t("black")}</span>
                </div>
              </Radio>
            </Row>
          </Radio.Group>
        </Col>
      </Row>
    </>
  );
};

export default ColorPicker;
