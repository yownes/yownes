import React, { ReactNode } from "react";
import { Col, Row } from "antd";

import styles from "./Descriptions.module.css";

export type description = {
  title: string | ReactNode;
  description: string | ReactNode;
};

interface DescriptionsProps {
  items: description[];
}

const Descriptions = ({ items }: DescriptionsProps) => {
  return (
    <>
      <Row>
        {items.map((val, i) => {
          if (i % 2) {
            return (
              <Col span={12}>
                <Col className={styles.titleCol}>
                  <span
                    className={`${styles.titleRight} ${
                      i === 1 && styles.borderTop
                    }`}
                  >
                    {val.title}
                  </span>
                  <span className={styles.descriptionRight}>
                    {val.description}
                  </span>
                </Col>
              </Col>
            );
          } else {
            return (
              <Col span={12}>
                <Col className={styles.descriptionCol}>
                  <span
                    className={`${styles.titleLeft} ${
                      i === 0 && styles.borderTop
                    }`}
                  >
                    {val.title}
                  </span>
                  <span className={styles.descriptionLeft}>
                    {val.description}
                  </span>
                </Col>
              </Col>
            );
          }
        })}
      </Row>
    </>
  );
};

export default Descriptions;
