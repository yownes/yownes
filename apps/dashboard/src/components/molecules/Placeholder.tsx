import { Button } from "antd";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./Placeholder.module.css";

interface PlaceholderProps {
  cta?: { title: string; link: string };
  claim: string;
  image?: string;
  children?: ReactNode;
}

const Placeholder = ({ claim, image, cta, children }: PlaceholderProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{claim}</h3>
      {image && <img src={styles.image} alt="claim" />}
      {cta && (
        <Link to={cta.link}>
          <Button type="primary">{cta.title}</Button>
        </Link>
      )}
      {children}
    </div>
  );
};

export default Placeholder;
