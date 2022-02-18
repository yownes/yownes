import type { ElementType } from "react";
import type { Control, FieldError, Path } from "react-hook-form";
import type { KeyboardTypeOptions } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

import { Box, Text } from "../atoms";

import InputWithErrors from "./InputWithErrors";

type KeyboardType = KeyboardTypeOptions | "password";

export interface FieldType<T> {
  name: string;
  key: Path<T>;
  required?: boolean;
  keyboardType?: KeyboardType;
  List?: ElementType;
  props?: Record<string, unknown>;
}

interface FormFieldsProps<T> {
  control: Control<T>;
  fields: FieldType<T>[];
}

function FormFields<T>({ fields, control }: FormFieldsProps<T>) {
  return (
    <>
      {fields.map(({ key, List, required, keyboardType, name, props }) => (
        <Box marginBottom="m" key={key as string}>
          <Controller
            control={control}
            name={key}
            render={({ field, formState }) => {
              const error = formState.errors[idx] as FieldError;
              return List ? (
                <>
                  <List
                    defaultValue={field.value ?? undefined}
                    onSelect={field.onChange}
                    {...props}
                  />
                  {Boolean(error?.message) && (
                    <Text color="danger">{error?.message}</Text>
                  )}
                </>
              ) : (
                <InputWithErrors
                  placeholder={`${name}${required ? " (*)" : ""}`}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  secureTextEntry={keyboardType === "password"}
                  keyboardType={
                    keyboardType === "password" ? undefined : keyboardType
                  }
                  value={(field.value as string) ?? undefined}
                  error={error?.message}
                />
              );
            }}
            rules={
              required ? { required: "Este campo es obligatorio" } : undefined
            }
          />
        </Box>
      ))}
    </>
  );
}

export default FormFields;
