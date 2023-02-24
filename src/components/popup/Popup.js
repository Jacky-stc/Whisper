import React from "react";
import Portal from "../portal/Portal";
import "./popup.scss";

const Popup = ({ children, onClose, open }) => {
  if (!open) {
    return null;
  }
  return (
    <Portal>
      <div className="popup"></div>
      <div className="overlay" tabIndex={0} role="button" onClick={onClose} />
      <div className="content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </Portal>
  );
};

export default Popup;
