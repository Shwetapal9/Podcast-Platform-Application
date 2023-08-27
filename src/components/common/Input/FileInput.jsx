import React, { useState } from "react";
import "./styles.css";
function FileInput({ accept, id, text, fileHandle, isSubmitted }) {
  const [fileSelected, setFileSelected] = useState(null);
  const onChange = (e) => {
    setFileSelected(e.target.files[0].name);
    fileHandle(e.target.files[0]);
  };

  return (
    <>    
      <label
        htmlFor={id}
        className={`custom-input custom-file-input ${!fileSelected ? "label-input" : "active"}`}        
      >
        {!isSubmitted && fileSelected ? `${fileSelected} ` : `${text}`}
      </label>
      <input
        type="file"
        accept={accept}
        id={id}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </>
  );
}

export default FileInput;
