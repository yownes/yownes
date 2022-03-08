import React from "react";

import { NewLogo } from "../atoms";

import styles from "./Auth.module.css";

interface AuthProps {
  image: string;
  children: React.ReactNode;
}

const Auth = ({ image, children }: AuthProps) => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <NewLogo />
        </div>
        {children}
      </div>
      <div className={styles.imageContainer}>
        <img alt="" src={image} className={styles.image} />
      </div>
    </main>
  );
};

export default Auth;
