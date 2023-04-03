import React, {useEffect, useState, useCallback} from "react";
import {useNavigate} from 'react-router-dom'
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import ImageGrid from "./components/ImageGrid";
import * as jose from 'jose'
import cuid from "cuid";
import { pdfjs, Document, Page } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function Home() {
    const navigate = useNavigate()

     async function logout() {
        // localStorage.removeItem('token')
        // navigate('/login')
     }

    // useEffect(() => {
    //     const token = localStorage.getItem('token')
    //     if(token){
    //         const user = jose.decodeJwt(token)
    //         if(!user){
    //             localStorage.removeItem('token')
    //             navigate('/login')
    //         }
    //         else{
    //             //
    //         }
    //     }
    //     else{
    //         navigate('/login')
    //     }
    // }, [])

  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileType = file.type.split('/')[0];
        if (fileType === 'image') { // display warning for no PDF file
          // process image files
          setImages((prevState) => [
            ...prevState,
            { id: cuid(), src: e.target.result, name: file },
          ]);
        } else if (fileType === 'application' && file.type.split('/')[1] === 'pdf') {
          // process pdf files
          const pdfData = new Uint8Array(e.target.result);
          pdfjs.getDocument(pdfData).promise.then((pdfDocument) => {
            pdfDocument.getPage(1).then((pdfPage) => {
              const viewport = pdfPage.getViewport({ scale: 0.5 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              document.body.appendChild(canvas); // Add canvas to DOM for debugging purposes
              pdfPage.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                const thumbnail = canvas.toDataURL();
                console.log(thumbnail);
                document.body.removeChild(canvas); // Remove canvas from DOM after rendering
                console.log(`Thumbnail generated for PDF file: ${file.name}`);
                setImages((prevState) => [
                    ...prevState,
                    { id: cuid(), src: e.target.result },
                  ]);
                }).catch((error) => {
                  console.error(`Error rendering PDF page: ${error}`);
                });
              }).catch((error) => {
                console.error(`Error getting PDF page: ${error}`);
              });
            }).catch((error) => {
              console.error(`Error loading PDF document: ${error}`);
            });
          } else {
            // handle unsupported file types
            console.log(`Unsupported file type: ${file.type}`);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }, []);

    return (
        <main className="App">
        <button onClick={logout}>Logout</button>

        <Header/>
        
        <Dropzone 
            onDrop={onDrop} 
            accept={"application.pdf"} 
            restrictions={{
            allowedExtensions: [".pdf"]
            }}
        />

        <ImageGrid images={images}/>

        </main>
    );
}

export default Home;