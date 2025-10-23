import React, { ReactElement } from "react";
import styles from "./preloader.module.css";

const Preloader = (): ReactElement => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Preloader;