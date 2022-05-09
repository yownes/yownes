import React from "react";
import { Button } from "antd";
import type { TriggerEventHandler } from "rc-table/lib/interface";

import styles from "./ExpandIcon.module.css";

interface ExpandIconProps<T> {
  expanded: boolean;
  onExpand: TriggerEventHandler<T>;
  record: T;
}

function expandIcon<T>({ expanded, onExpand, record }: ExpandIconProps<T>) {
  return expanded ? (
    <Button className={styles.button} onClick={(e) => onExpand(record, e)}>
      <span className={styles.span}>-</span>
    </Button>
  ) : (
    <Button className={styles.button} onClick={(e) => onExpand(record, e)}>
      <span className={styles.span}>+</span>
    </Button>
  );
}

export default expandIcon;
