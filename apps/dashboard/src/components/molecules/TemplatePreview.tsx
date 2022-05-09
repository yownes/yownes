import React from "react";

import { colors } from "../../lib/colors";

import styles from "./TemplatePreview.module.css";

interface TemplatePreviewProps {
  image: string;
  name: string;
  selected: boolean;
}

const TemplatePreview = ({ image, name, selected }: TemplatePreviewProps) => {
  return (
    <div>
      <div
        className={`${styles.imageContainer} ${
          selected && styles.imageSelected
        }`}
      >
        {image ? (
          <img className={styles.image} src={image} />
        ) : (
          <div className={styles.noImage} />
        )}
      </div>
      <div
        className={styles.name}
        style={{ color: selected ? colors.green : undefined }}
      >
        {name}
      </div>
    </div>
  );
};

export default TemplatePreview;
