/**
 * Using some code from:
 * https://alligator.io/react/modal-component/
 */

import React from 'react';

import "./modal.css";

const Modal = (props) => {
  const showHideClassName = props.show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button className="close-btn" onClick={props.handleClose}>x</button>
        {props.children}
      </section>
    </div>
  );
};

export default Modal;
