import React from "react";
import { useDropzone } from "react-dropzone";
import "./Dropzone.css";

function Dropzone({ onDrop, accept, open }) {

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: "./pdf",
      onDrop,
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content">
              Release to drop the files here
            </p>
          ) : (
            <p className="dropzone-content">
              Drag’ n’ drop some files here, or click to select files. 
              Please only upload PDF files
            </p>
          )}
          <button type="button" onClick={open} className="btn">
            Click to select files
          </button>
        </div>
      </div>
    </div>
  );
}
export default Dropzone;