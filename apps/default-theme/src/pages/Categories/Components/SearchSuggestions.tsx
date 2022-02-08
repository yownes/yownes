import React from "react";
import { FlatList } from "react-native";
import { BasicProduct } from "@yownes/api";

import { Box, Card } from "../../../components/atoms";
import filterNulls from "../../../lib/filterNulls";

import ProductSuggestion from "./ProductSuggestion";

interface SearchSuggestionsProps {
  products: (BasicProduct | null)[];
}

const SearchSuggestions = ({ products }: SearchSuggestionsProps) => {
  const prods = products.filter(filterNulls);
  return (
    <Card flex={1} variant="elevated">
      <FlatList
        data={prods}
        keyExtractor={(item, idx) => item.id ?? idx.toString()}
        renderItem={({ item }) => (
          <Box paddingBottom="m">
            <ProductSuggestion product={item} />
          </Box>
        )}
      />
    </Card>
  );
};

export default SearchSuggestions;
