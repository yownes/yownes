import React from "react";
import type { ReactNode } from "react";
import { Form } from "antd";
import type { Rule } from "antd/lib/form";
import type { NamePath } from "antd/lib/form/interface";

import "./TextField.css";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  autofocus?: boolean;
  children?: ReactNode;
  creditcard?: boolean;
  defaultValue?: number | string;
  dependencies?: NamePath[];
  disabled?: boolean;
  label: string;
  max?: number;
  min?: number;
  name: string;
  rows?: number;
  rules?: Rule[];
  single?: boolean;
  small?: boolean;
  type?: "email" | "number" | "password" | "text" | "textarea" | "url";
  value?: number | string;
  wrapperClassName?: string;
}

function handleMin(
  type:
    | "number"
    | "email"
    | "password"
    | "text"
    | "textarea"
    | "url"
    | undefined,
  min?: number
) {
  if (min) {
    return min;
  } else {
    if (type === "number") {
      return 0;
    } else {
      return undefined;
    }
  }
}

const TextField = ({
  autofocus,
  children,
  creditcard,
  defaultValue,
  dependencies,
  disabled,
  label,
  max,
  min,
  name,
  rows,
  rules,
  single,
  small,
  type,
  value,
  wrapperClassName,
  ...props
}: TextFieldProps) => {
  const required = rules?.find((r) => r.hasOwnProperty("required"));

  return single ? (
    <div className="container">
      <label
        className={`pure-material-textfield-outlined ${
          small ? "pure-material-textfield-outlined--small" : ""
        } ${false ? "pure-material-textfield-outlined-error" : ""}`}
      >
        {children && <div className="input">{children}</div>}
        {!children && type === "textarea" ? (
          <textarea
            autoFocus={autofocus}
            defaultValue={defaultValue}
            disabled={disabled}
            maxLength={props.maxLength ?? undefined}
            minLength={props.maxLength ?? undefined}
            name={name}
            placeholder=" "
            rows={rows}
            value={value ?? ""}
          />
        ) : (
          <input
            autoFocus={autofocus}
            type={type ?? "text"}
            disabled={disabled}
            name={name}
            placeholder=" "
            defaultValue={defaultValue}
            max={max ?? undefined}
            min={handleMin(type, min)}
            value={value ?? ""}
            {...props}
          />
        )}
        <span>
          {required && "* "}
          {label}
        </span>
      </label>
    </div>
  ) : (
    <Form.Item
      className={wrapperClassName}
      dependencies={dependencies}
      name={name}
      rules={rules}
    >
      <div>
        <label
          className={`pure-material-textfield-outlined ${
            small ? "pure-material-textfield-outlined--small" : ""
          } ${false ? "pure-material-textfield-outlined-error" : ""}`}
        >
          {children && <div className="input">{children}</div>}
          {!children && type === "textarea" ? (
            <textarea
              autoFocus={autofocus}
              defaultValue={defaultValue}
              disabled={disabled}
              maxLength={props.maxLength ?? undefined}
              minLength={props.maxLength ?? undefined}
              placeholder=" "
              rows={rows}
              value={value}
            />
          ) : (
            <input
              autoFocus={autofocus}
              type={type ?? "text"}
              disabled={disabled}
              placeholder=" "
              defaultValue={defaultValue}
              max={max ?? undefined}
              min={handleMin(type, min)}
              value={value}
              {...props}
            />
          )}
          <span>
            {required && "* "}
            {label}
          </span>
        </label>
      </div>
    </Form.Item>
  );
};

export default TextField;
