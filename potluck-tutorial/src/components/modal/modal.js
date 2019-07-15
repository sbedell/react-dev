/**
 * Using some code from:
 * https://alligator.io/react/modal-component/
 * 
 * Some tips on Functional vs. Class components: 
 * https://guide.freecodecamp.org/react/functional-components-vs-class-components/
 */

import React from 'react';

import "./modal.css";

// "Function" version
function Modal(props) {
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

/* Class version:
class Modal extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <button className="close-btn" onClick={this.props.handleClose}>x</button>
          { this.props.children }
        </section>
      </div>
    );
  }
}
*/
