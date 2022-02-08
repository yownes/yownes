import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box, Card, Input } from "../atoms";
import { Cross, Search } from "../icons";

interface SearchHeaderProps {
  onChange: (value: string) => void;
  value: string;
}

const SearchHeader = ({ onChange, value }: SearchHeaderProps) => {
  return (
    <Card padding="m" justifyContent="center">
      <SafeAreaView edges={["top"]}>
        <Box alignItems="center" flexDirection="row">
          <Box position="absolute">
            <Search color="greyscale4" size={15} />
          </Box>
          <Box flex={1}>
            <Input
              placeholder="Buscar..."
              onChangeText={onChange}
              value={value}
              style={{ paddingLeft: 25 }}
            />
          </Box>
          {value !== "" && (
            <TouchableOpacity
              onPress={() => {
                onChange("");
              }}
            >
              <Cross color="greyscale4" size={15} />
            </TouchableOpacity>
          )}
        </Box>
      </SafeAreaView>
    </Card>
  );
};

export default SearchHeader;
