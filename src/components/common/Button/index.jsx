import React from "react";
import "./styles.css";

function Button({
  text,
  onClick,
  disabled,
  width,
  marginleft,
  bgcolor,
  textcolor,
}) {
  return (
    <div
      onClick={onClick}
      className="custom-btn"
      disabled={disabled}
      style={{
        width: width,
        marginLeft: marginleft,
        backgroundColor: bgcolor,
        color: textcolor,
      }}
    >
      {text}
    </div>
  );
}

export default Button;
