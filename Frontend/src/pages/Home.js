import React, { useState, useCallback, useEffect} from "react";
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import ImageGrid from "./components/ImageGrid";
import './components/ImageGrid.css';
import cuid from "cuid";
import { pdfjs, Document, Page } from 'react-pdf';
import * as jose from 'jose'
import {useNavigate} from 'react-router-dom'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let extractedText = null

async function extract(file, thumbnail){
    const formData = new FormData()
    formData.append("pdfFile", file)
    const res = await fetch("http://localhost:1338/extract-text", {
        method: "post",
        body: formData
    });

    extractedText = await res.json();
    if (extractedText) {
        const formData2 = new FormData()
        formData2.append("text", JSON.stringify(extractedText))
        formData2.append("thumbnail", thumbnail)
        const res = await fetch("http://localhost:1337/api/upload", {
            method: "post",
            headers: {"x-access-token" : localStorage.getItem("token"),},
            body: formData2
        });
        if(res){
            return "Success";
        }
        else{
            return "Upload Error";
        }
    }
    else{
        return "PDF Error";
    }
}

function Home() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            const user = jose.decodeJwt(token)
            if(!user){
                localStorage.removeItem('token')
                navigate('/login')
            }
            else{
                //
            }
        }
        else{
            navigate('/login')
        }
    }, [])

    const [images, setImages] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileType = file.type.split('/')[0];
            if (fileType === 'image') { // display warning for no PDF file
            // process image files
            } 
            else if (fileType === 'application' && file.type.split('/')[1] === 'pdf') {
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
                pdfPage.render({ canvasContext: context, viewport: viewport }).promise.then(async() => {
                    const thumbnail = canvas.toDataURL();
                    await extract(file, thumbnail)
                    document.body.removeChild(canvas); // Remove canvas from DOM after rendering
                    console.log(`Thumbnail generated for PDF file: ${file.name}`);
                    setImages((prevState) => [
                        ...prevState,
                        { id: cuid(), src: thumbnail, name: extractedText.courseName },
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

export default Home