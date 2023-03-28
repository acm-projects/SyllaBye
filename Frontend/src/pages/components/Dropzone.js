import React from "react";

// import { useDropzone } from "react-dropzone";
// import { Document, Page } from 'react-pdf';

function Dropzone({ onDrop, accept, open }) {

  // const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
  //   useDropzone({
  //     accept: "./pdf",
  //     onDrop,
  //   });

  // const files = acceptedFiles.map((file) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  const inpFile = document.getElementById('inpFile');
  // const btnUpload = document.getElementById('btnUpload');

  async function clickUpload() {
    const formData = new FormData();
    formData.append("pdfFile", inpFile.files[0]);
    // console.log("test");
    const res = await fetch("http://localhost:1337/extract-text", {
        method: "post",
        body: formData
    });

    const extractedText = await res.json();
    if (extractedText) {
       console.log(extractedText);
       return extractedText;
    }
    else{
      return "Error";
    }
  }

  // btnUpload.addEventListener("click", () => {
  //   const formData = new FormData();
  //   formData.append("pdfFile", inpFile.files[0]);
  //   fetch("/extract-text", {
  //       method: "post",
  //       body: formData
  //   }).then(response => {
  //       return response.text();
  //   }).then(extractedText => {
  //       resultText.value = extractedText;
  //   })
  // });

  // return (
  //   <div>
  //     <div {...getRootProps({ className: "dropzone" })}>
  //       <input className="input-zone" {...getInputProps()} />
  //       <div className="text-center">
  //         {isDragActive ? (
  //           <p className="dropzone-content">
  //             Release to drop the files here
  //           </p>
  //         ) : (
  //           <p className="dropzone-content">
  //             Drag’ n’ drop some files here, or click to select files
  //             <br></br>
  //             Please only upload PDF files
  //           </p>
  //         )}
  //         {/* <button type="button" onClick={open} className="btn">
  //           Click to select files
  //         </button> */}
  //         {/* <input type="file" id="inpFile"/>
  //         <button type="button" id="btnUpload">Upload</button> */}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div>
      <input type="file" id="inpFile"/>
      <input
        type="button"
        id="btnUpload"
        value="Upload"
        onClick={() => { clickUpload() }}
      />
    </div>
  );
}
export default Dropzone;