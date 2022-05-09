import React from "react";
import { Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import get from "lodash/get";

import { TextField } from "../components/atoms";

import { colors } from "./colors";

interface FilterDropdownProps {
  setSelectedKeys: (keys: string[]) => void;
  selectedKeys: string[];
  confirm: () => void;
  clearFilters: () => void;
}

export interface Filter {
  children?: Filter[];
  defaultExpandedKeys?: string[];
  key?: string;
  text: React.ReactNode;
  value: string | boolean;
}

export function getColumnSearchProps<T>(
  dataIndex: keyof T | string[],
  dataHolder: string,
  search: string,
  reset: string,
  render?: boolean
) {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <TextField
          autoFocus
          label={dataHolder}
          name={dataHolder}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch(confirm);
            }
          }}
          single
          style={{ width: 188 }}
        />
        <Space>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {reset}
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            size="small"
            style={{ width: 90 }}
          >
            {search}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{ color: filtered ? colors.primary : undefined }}
      />
    ),
    onFilter: (value: string | number | boolean, record: T): boolean => {
      const valuee = get(record, dataIndex);
      const regex = new RegExp(value as string, "i");
      return regex.test(valuee);
    },
    ...(render ? (text: React.ReactNode | string) => text : null),
  };
}

export function getColumnFilterProps<T>(
  dataIndex: string[],
  filters: Filter[],
  position?: "first" | "last",
  defaultValue?: string | number | boolean
) {
  const index = dataIndex.indexOf("_");
  return {
    filters: filters,
    onFilter: (value: string | number | boolean, record: T): boolean => {
      if (position === "first") {
      }
      if (position === "last") {
        const data = dataIndex;
        data[index] = String(get(record, data.slice(0, index)).length - 1);
        const valuee = get(record, data) ?? defaultValue ?? "-";
        const regex = new RegExp(value as string, "i");
        return regex.test(valuee);
      }
      const valuee = get(record, dataIndex) ?? defaultValue ?? "-";
      const regex = new RegExp(value as string, "i");
      return regex.test(valuee);
    },
  };
}
const handleSearch = (confirm: () => void) => {
  confirm();
};
const handleReset = (clearFilters: () => void) => {
  clearFilters();
};
