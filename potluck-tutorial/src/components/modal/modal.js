/**
 * Using some code from:
 * https://alligator.io/react/modal-component/
 * 
 * Some tips on Functional vs. Class components: 
 * https://guide.freecodecamp.org/react/functional-components-vs-class-components/
 */

import React from 'react';

import "./modal.css";

function Modal(props) {
  const showHideClassName = props.show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button className="close-btn btn" onClick={props.handleClose}>x</button>
        {props.children}
      </section>
    </div>
  );
};

export default Modal;
