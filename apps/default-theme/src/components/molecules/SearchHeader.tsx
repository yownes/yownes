import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@shopify/restyle";

import type { Theme } from "../../lib/theme";

import { Box, Card, Input } from "../atoms";
import { Cross, Search } from "../icons";

interface SearchHeaderProps {
  onChange: (value: string) => void;
  value: string;
}

const SearchHeader = ({ onChange, value }: SearchHeaderProps) => {
  const theme = useTheme<Theme>();
  return (
    <Card paddingHorizontal="l" paddingVertical="m" justifyContent="center">
      <SafeAreaView edges={["top"]}>
        <Box alignItems="center" flexDirection="row">
          <Box position="absolute" left={15} zIndex={9}>
            <Search color="greyscale3" size={15} />
          </Box>
          <Box flex={1}>
            <Input
              placeholder="Buscar..."
              placeholderTextColor={theme.colors.greyscale3}
              onChangeText={onChange}
              value={value}
              style={{
                backgroundColor: theme.colors.greyscale2,
                borderRadius: 40,
                borderBottomWidth: 0,
                color: theme.colors.greyscale3,
                paddingHorizontal: 40,
              }}
            />
          </Box>
          {value !== "" && (
            <Box position="absolute" right={15}>
              <TouchableOpacity
                onPress={() => {
                  onChange("");
                }}
              >
                <Cross color="greyscale3" size={15} />
              </TouchableOpacity>
            </Box>
          )}
        </Box>
      </SafeAreaView>
    </Card>
  );
};

export default SearchHeader;
