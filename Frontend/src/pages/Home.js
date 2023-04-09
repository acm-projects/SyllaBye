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

function Home() {
    const navigate = useNavigate()
    var num = 0;
    // async function logout() {
    //     localStorage.removeItem('token')
    //     navigate('/login')
    // }

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
  const [classes, setClasses] = useState([]);
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
          var courseName = 'CS 3345' + num;
          var classInfo = [];
          classInfo.push({field: 'Name', info: 'Virat Kohli'});
          var grades = [];
          grades.push({range: '94-100', grade: 'A'});
          var gradeDistribution = [];
          gradeDistribution.push({field: 'Homework', weight: '35%'});
          var dates = [];
          setClasses((prevState) => [
            ...prevState,
            {classID: prevState.classID + 1, name: courseName, classInfo: classInfo, grades: grades, gradeDistribution: gradeDistribution, dates: dates},
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
                document.body.removeChild(canvas); // Remove canvas from DOM after rendering
                console.log(`Thumbnail generated for PDF file: ${file.name}`);
                setImages((prevState) => [
                  ...prevState,
                  { id: cuid(), src: thumbnail, name: file.name },
                ]);
                var courseName = 'CS 3345';
                var classInfo = [];
                classInfo.push({field: 'Name', info: 'Virat Kohli' + num});
                var grades = [];
                grades.push({range: '94-100', grade: 'A'});
                var gradeDistribution = [];
                gradeDistribution.push({field: 'Homework', weight: '35%'});
                var dates = [];
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
    // var courseNames = classes.map(c => c.name);
    // console.log(courseNames);
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