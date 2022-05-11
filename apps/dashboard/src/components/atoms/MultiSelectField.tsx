import React from "react";
import { Form, Select, Tag } from "antd";
import type { Rule } from "antd/lib/form";

import "./MultiSelectField.css";

import { colors } from "../../lib/colors";

const { Option } = Select;

interface Option {
  id: string | number;
  name: string;
}

interface MultiSelectFieldProps {
  defaultValue?: string[];
  label: string;
  name: string;
  onChange?: () => void;
  options: Option[];
  rules?: Rule[];
  value?: string[];
  wrapperClassName?: string;
}

const SelectField = ({
  defaultValue,
  label,
  name,
  onChange,
  options,
  rules,
  value,
  wrapperClassName,
}: MultiSelectFieldProps) => {
  const required = rules?.find((r) => r.hasOwnProperty("required"));

  return (
    <div className={`wrapper ${wrapperClassName}`}>
      <label
        className={`pure-material-textfield-outlined ${
          false ? "pure-material-textfield-outlined-error" : ""
        }`}
      >
        <div className="multiselect">
          <Form.Item className="form-item" name={name} rules={rules}>
            <Select
              onChange={onChange}
              showSearch={false}
              allowClear
              defaultValue={defaultValue}
              mode="multiple"
              showArrow
              tagRender={(props) => (
                <Tag
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  closable={true}
                  onClose={props.onClose}
                  color={colors.tagGreen}
                  style={{ margin: "2px 4px" }}
                >
                  {props.label}
                </Tag>
              )}
              value={value}
            >
              {options.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <span>
          {required && "* "}
          {label}
        </span>
      </label>
    </div>
  );
};

export default SelectField;
