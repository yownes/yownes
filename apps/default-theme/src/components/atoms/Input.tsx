import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#9b9b9b",
    color: "#9b9b9b",
    padding: 10,
  },
});

const Input = ({ style, ...props }: TextInputProps) => {
  return <TextInput style={[styles.input, style]} {...props} />;
};

export default Input;
