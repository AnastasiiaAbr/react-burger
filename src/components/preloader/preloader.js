import React from "react";
import styles from "./preloader.module.css";

const Preloader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Preloader;