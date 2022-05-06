import React from "react";
import { Form } from "antd";
import { Rule } from "antd/lib/form";

import "./SelectField.css";

export interface Option {
  id: string | number;
  name: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  defaultEmpty?: boolean;
  defaultValue?: string;
  label: string;
  name: string;
  options: Option[];
  rules?: Rule[];
  value?: number | string;
  wrapperClassName?: string;
  onChange?: () => void;
}

const SelectField = ({
  defaultValue,
  defaultEmpty,
  label,
  name,
  onChange,
  options,
  rules,
  value,
  wrapperClassName,
}: SelectFieldProps) => {
  const required = rules?.find((r) => r.hasOwnProperty("required"));

  return (
    <Form.Item className={wrapperClassName} name={name} rules={rules}>
      <div className="select">
        <select
          className="select-text"
          defaultValue={defaultValue ?? ""}
          // required
          value={value}
          onChange={onChange}
        >
          {defaultEmpty && <option key="0" disabled value=""></option>}
          {options.map((o) => (
            <option key={o.id} disabled={o.disabled ?? undefined} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <label className="select-label">
          {required && "* "}
          {label}
        </label>
      </div>
    </Form.Item>
  );
};

export default SelectField;
