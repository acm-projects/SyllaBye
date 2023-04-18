import React, {useEffect, useState, useCallback} from "react";
import {useNavigate} from 'react-router-dom'
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import ImageGrid from "./components/ImageGrid";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import * as jose from 'jose'
import NavBar from "./NavBar";
import FileDetails from "./FileDetails";
import cuid from "cuid";
import './Home.css'
import { pdfjs, Document, Page } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let extractedText = null;

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
    var num = 0;
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
    const [classes, setClasses] = useState([]);
    
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileType = file.type.split('/')[0];
            if (fileType === 'image') { // display warning for no PDF file
              // process image files
              
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
                pdfPage.render({ canvasContext: context, viewport: viewport }).promise.then(async () => {
                    const thumbnail = canvas.toDataURL();
                    await extract(file, thumbnail)
                    document.body.removeChild(canvas); // Remove canvas from DOM after rendering
                    console.log(`Thumbnail generated for PDF file: ${file.name}`);
                    setImages((prevState) => [
                        ...prevState,
                        { id: cuid(), src: thumbnail, name: extractedText.courseName },
                    ]);
                    var courseName = extractedText.courseNum;
                var classInfo = [];
                classInfo.push({field: 'Professor Name', info: extractedText.professorName});
                classInfo.push({field: "Professor email", info: extractedText.professorEmail});
                classInfo.push({field: "Professor phone", info: extractedText.professorPhone});
                classInfo.push({field: "Office location", info: extractedText.officeLocation});
                classInfo.push({field: "Office hours", info: extractedText.officeHours});
                classInfo.push({field: "Class times", info: extractedText.meetings})
                var grades = [];
                grades.push({range: '94-100', grade: 'A'});
                var gradeDistribution = extractedText.grades;
                // gradeDistribution.push({field: 'Homework', weight: '35%'});
                var dates = extractedText.calendar;
                num++;
                setClasses((prevState) => [
                  ...prevState,
                  {classID: prevState.classID + 1, course: courseName, classInfo: classInfo, grades: grades, gradeDistribution: gradeDistribution, dates: dates},
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
    function changeClass2(e){
      <Route path = "/details" element = {<FileDetails />}/>
      //navigate('/details');
      // <FileDetails courses = {classes} index = {e.target.id} />
      navigate('/details', {state: { courses : classes, index: e.target.id}});
      
    }
    return (
      <main className="App">
      {/* <button onClick={logout}>Logout</button> */}

      <Header/>
      <div className = "fullpage">
      <div className = "wrapper">
      <NavBar className = "navbar" username = "Rahul" items = {classes.map(c => c.course)} changeClass = {changeClass2} />
      <div className = "elements">
      <Dropzone 
          onDrop={onDrop} 
          accept={"application.pdf"} 
          restrictions={{
          allowedExtensions: [".pdf"]
          }}
      />
      <ImageGrid className="imagegrid" images={images}/>
      </div>
      </div>
      </div>
      </main>
  );
}

export default Home;