import React from "react";

import styles from "./TemplatePreview.module.css";

interface TemplatePreviewProps {
  name: string;
  image: string;
}

const TemplatePreview = ({ name, image }: TemplatePreviewProps) => {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={image}
        alt={`Template preview for ${name}`}
      />
      <span className={styles.name}>{name}</span>
    </div>
  );
};

export default TemplatePreview;
