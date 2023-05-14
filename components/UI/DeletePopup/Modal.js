import React from "react";
import CSSTransition from "react-transition-group/CSSTransition";

const animationTiming = {
  enter: 600,
  exit: 600,
};

const Modal = (props) => {
  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={animationTiming}
      classNames={{
        enter: "",
        enterActive: "ModalOpen",
        exit: "",
        exitActive: "ModalClosed",
      }}
    >
      <div className="Modal">
        <h1 className="font-normal">
          Do you really want to delete <b>{props.deletedItemName}</b>?
        </h1>
        <div className="modalActions flex items-center gap-4 justify-center">
          <button
            className="bg-gray-800 hover:bg-gray-600 text-white rounded-sm px-3 py-1"
            onClick={props.closed}
          >
            No
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 text-white rounded-sm px-3 py-1"
            onClick={props.onDelete}
          >
            Yes
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
