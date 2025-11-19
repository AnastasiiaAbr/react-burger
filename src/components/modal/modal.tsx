import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import ModalOverlay from "../modal-overlay/modal-overlay";
import styles from "./modal.module.css";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

const modalRoot = document.getElementById("modal-root")!;

type TModalProps = {
  title?: string;
  onClose: () => void;
  titleStyle?: "none" | "number" | "main";
  children: React.ReactNode;
};

const Modal = ({ title, onClose, titleStyle = "main", children }: TModalProps): React.JSX.Element => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          {titleStyle === "none" ? (
            <div />
          ) : (
          <h2
            className={
              titleStyle === "number"
                ? `text text_type_digits-small ${styles.numberTitle}`
                : styles.mainTitle
            }
          >
            {title}
          </h2>
  )}

          <button type="button" className={styles.closeButton} onClick={onClose}>
            <CloseIcon type="primary" />
          </button>
        </header>

        <div className={styles.mainInfo}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
