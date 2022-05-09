import React from "react";
import { Typography } from "antd";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import type { Errors as IErrors } from "../../lib/auth";

const { Text } = Typography;

interface ErrorsProps {
  errors?: IErrors;
  fields?: string[];
}

const Error = ({ message }: { message: string }) => (
  <Text style={{ display: "block" }} type="danger">
    {message}{" "}
  </Text>
);

const Errors = ({ errors, fields }: ErrorsProps) => {
  const { t } = useTranslation("auth");
  if (!errors) {
    return null;
  }
  return (
    <div>
      {errors.nonFieldErrors?.map((e) =>
        i18n.exists(`auth:auth_errors.${e.code}`) ? (
          <Error key={e.code} message={t(`auth_errors.${e.code}`)} />
        ) : (
          <Error key={e.code} message={e.message} />
        )
      )}
      {fields &&
        fields.map((field) =>
          errors[field]?.map((e) =>
            i18n.exists(`auth:auth_errors.${e.code}`) ? (
              <Error key={e.code} message={t(`auth_errors.${e.code}`)} />
            ) : (
              <Error key={e.code} message={e.message} />
            )
          )
        )}
    </div>
  );
};

export default Errors;
