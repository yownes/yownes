import React from "react";
import { useGetCountries } from "@yownes/api";

import { Select, SelectItem } from "../../molecules";
import filterNulls from "../../../lib/filterNulls";

interface ListCountriesProps {
  onSelect: (country?: string | null) => void;
  defaultValue?: string;
}

const ListCountries = ({ onSelect, defaultValue }: ListCountriesProps) => {
  const { data } = useGetCountries();
  const list = data?.countriesList?.content?.filter(filterNulls);
  const items = list?.map((country) => (
    <SelectItem key={country?.id} id={country?.id} title={country?.name} />
  ));
  if (!items) {
    return null;
  }
  return (
    <Select
      placeholder="Selecciona el país"
      defaultValue={defaultValue}
      onChange={onSelect}
      formatSelectedValue={(value) =>
        data?.countriesList?.content?.find((c) => c?.id === value)?.name || ""
      }
    >
      {items}
    </Select>
  );
};

export default ListCountries;
