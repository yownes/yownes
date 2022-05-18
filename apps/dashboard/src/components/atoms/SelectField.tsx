import React from "react";
import type { ReactNode } from "react";
import { Form } from "antd";
import type { Rule } from "antd/lib/form";

import "./SelectField.css";

export interface Option {
  id: string | number;
  name: string | ReactNode;
  disabled?: boolean;
}

interface SelectFieldProps {
  defaultEmpty?: boolean;
  defaultValue?: string;
  label?: string;
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
          {defaultEmpty && <option key="0" disabled value="" />}
          {options.map((o) => (
            <option key={o.id} disabled={o.disabled ?? undefined} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        {label && (
          <label className="select-label">
            {required && "* "}
            {label}
          </label>
        )}
      </div>
    </Form.Item>
  );
};

export default SelectField;
