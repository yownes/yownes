import React from "react";
import { useGetZones } from "@yownes/api";

import { Select, SelectItem } from "../../molecules";
import filterNulls from "../../../lib/filterNulls";

interface ListZonesProps {
  countryId?: string | null;
  onSelect: (country?: string | null) => void;
  defaultValue?: string;
}

const ListZones = ({ countryId, onSelect, defaultValue }: ListZonesProps) => {
  const { data } = useGetZones(countryId);
  const list = data?.zonesList?.content?.filter(filterNulls);
  if (!list) {
    return null;
  }
  return (
    <Select
      placeholder="Selecciona la provincia"
      defaultValue={defaultValue}
      onChange={onSelect}
      formatSelectedValue={(value) =>
        data?.zonesList?.content?.find((c) => c?.id === value)?.name || ""
      }
    >
      {list?.map((zone) => (
        <SelectItem key={zone?.id} id={zone?.id} title={zone?.name} />
      ))}
    </Select>
  );
};

export default ListZones;
