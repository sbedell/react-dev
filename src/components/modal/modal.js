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
        {props.children}
        <button onClick={props.handleClose}>close</button>
      </section>
    </div>
  );
};

export default Modal;
