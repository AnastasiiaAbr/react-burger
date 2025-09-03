import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ModalOverlay from "../modal-overlay/modal-overlay";
import styles from './modal.module.css';
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

const modalRoot = document.getElementById('modal-root');

const Modal = ({title, onClose, children, closeStyle}) => {

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
    <ModalOverlay onClose={onClose} />
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className="text text_type_main-large">{title}</h2>
          <button type='button' className={`${styles.closeButton} ${styles[closeStyle]}`} onClick={onClose}>
            <CloseIcon type='primary' />
            </button>
        </header>

        <div className={styles.mainInfo}>{children}</div>
      </div>
    </>, modalRoot
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  closeStyle: PropTypes.oneOf(['inline', 'absolute']).isRequired,
};

export default Modal;