import React, { ReactNode } from "react";
import { Col, Row } from "antd";

import styles from "./Descriptions.module.css";

export type description = {
  title: string | ReactNode;
  description: string | ReactNode;
};

interface DescriptionsProps {
  cols?: 1 | 2;
  items: description[];
}

const Descriptions = ({ cols = 2, items }: DescriptionsProps) => {
  return (
    <>
      <Row>
        {items.map((val, i) => {
          return (
            <Col key={i} span={cols === 2 ? 12 : 24}>
              <Col
                className={
                  cols === 2
                    ? i % 2
                      ? styles.rightCol
                      : styles.leftCol
                    : undefined
                }
              >
                <span
                  className={`${styles.title} ${
                    (i === 0 || (i === 1 && cols === 2)) && styles.borderTop
                  }`}
                >
                  {val.title}
                </span>
                <span
                  className={
                    typeof val.description === "string"
                      ? styles.descriptionText
                      : styles.description
                  }
                >
                  {val.description}
                </span>
              </Col>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default Descriptions;
