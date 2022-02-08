import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Box, Text } from "../../../components/atoms";
import { Grid, List } from "../../../components/icons";

interface FiltersProps {
  list: boolean;
  onListChange: (value: boolean) => void;
  onFiltersPress: () => void;
  onSortPress: () => void;
}

export const BAR_HEIGHT = 44;

const Filters = ({
  list,
  onListChange,
  onFiltersPress,
  onSortPress,
}: FiltersProps) => {
  return (
    <Box
      padding="m"
      alignItems="center"
      backgroundColor="white"
      justifyContent="space-between"
      flexDirection="row"
    >
      <Box flex={1}>
        <TouchableOpacity onPress={onSortPress}>
          <Text>Ordenar</Text>
        </TouchableOpacity>
      </Box>
      <Box flex={1} alignItems="center">
        <TouchableOpacity onPress={() => onListChange(!list)}>
          {list ? (
            <Grid color="dark" size={24} />
          ) : (
            <List color="dark" size={24} />
          )}
        </TouchableOpacity>
      </Box>
      <Box flex={1} alignItems="flex-end">
        <TouchableOpacity onPress={onFiltersPress}>
          <Text>Filtrar</Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export default Filters;
