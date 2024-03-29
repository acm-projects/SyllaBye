import React, { useState, useCallback, useEffect} from "react";
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import ImageGrid from "./components/ImageGrid";
import './Home.css';
import './components/ImageGrid.css';
import cuid from "cuid";
import { pdfjs, Document, Page } from 'react-pdf';
import * as jose from 'jose'
import NavBar from "./NavBar";
import FileDetails from "./FileDetails";
import {useNavigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let extractedText = null;
let userName = null;

async function extract(file, thumbnail){
    const formData = new FormData()
    formData.append("pdfFile", file)
    // console.log("test");
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

function Home(){
    const [images, setImages] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classNms, setClassNms] = useState([]);
    const navigate = useNavigate()
    // var num = 0;
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            const user = jose.decodeJwt(token)
            if(!user){
                localStorage.removeItem('token')
                navigate('/login')
            }
            else{
                userName = user.name;

                const files = fetch("http://localhost:1337/api/files", {
                    method: "GET",
                    headers: {"x-access-token" : localStorage.getItem("token"),},
                }).then((res) => {
                    return res.json()
                }).then((res) => {
                    res.forEach((file) => {
                        var courseName = file.fileData.courseNum;
                        var classInfo = [];
                        classInfo.push({field: 'Professor Name', info: file.fileData.professorName});
                        classInfo.push({field: "Professor email", info: file.fileData.professorEmail});
                        classInfo.push({field: "Professor phone", info: file.fileData.professorPhone});
                        classInfo.push({field: "Office location", info: file.fileData.officeLocation});
                        classInfo.push({field: "Office hours", info: file.fileData.officeHours});
                        classInfo.push({field: "Class times", info: file.fileData.meetings});
                        var CourseDes = file.fileData.courseDescription;
                        var gradeDistribution = file.fileData.grades;
                        var dates = file.fileData.calendar;
                        var gridID = cuid();
                        setClasses((prevState) => [
                            ...prevState,
                            { id: gridID, classID: prevState.classID + 1, course: courseName, classInfo: classInfo, description: CourseDes, gradeDistribution: gradeDistribution, dates: dates}
                        ]);
                        setImages((prevState) => [
                            ...prevState,
                            { id: gridID, src: file.thumbnail, name: file.fileData.courseNum + ': ' + file.fileData.courseName },
                        ]);
                        setClassNms((prevState) => [
                            ...prevState,
                            {name: "buttonForClassChange"}
                        ]);
                    })
                });
            }
        }
        else{
            navigate('/login')
        }
    }, [])

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
                document.body.appendChild(canvas);
                pdfPage.render({ canvasContext: context, viewport: viewport }).promise.then(async() => {
                    const thumbnail = canvas.toDataURL();
                    await extract(file, thumbnail)
                    document.body.removeChild(canvas); // Remove canvas from DOM after rendering
                    console.log(`Thumbnail generated for PDF file: ${file.name}`);
                    var courseName = extractedText.courseNum;
                    var classInfo = [];
                    classInfo.push({field: 'Professor Name', info: extractedText.professorName});
                    classInfo.push({field: "Professor email", info: extractedText.professorEmail});
                    classInfo.push({field: "Professor phone", info: extractedText.professorPhone});
                    classInfo.push({field: "Office location", info: extractedText.officeLocation});
                    classInfo.push({field: "Office hours", info: extractedText.officeHours});
                    classInfo.push({field: "Class times", info: extractedText.meetings})
                    // var grades = [];
                    // grades.push({range: '94-100', grade: 'A'});
                    var CourseDes = extractedText.courseDescription;
                    
                    var gradeDistribution = extractedText.grades;
                    // gradeDistribution.push({field: 'Homework', weight: '35%'});
                    var dates = extractedText.calendar;
                    // num++;
                    var gridID = cuid();
                    setClasses((prevState) => [
                        ...prevState,
                        {id: gridID, classID: prevState.classID + 1, course: courseName, classInfo: classInfo, description: CourseDes, gradeDistribution: gradeDistribution, dates: dates},
                    ]);
                    setImages((prevState) => [
                        ...prevState,
                        { id: gridID, src: thumbnail, name: extractedText.courseNum + ': ' + extractedText.courseName },
                    ]);
                    setClassNms((prevState) => [
                        ...prevState,
                        {name: "buttonForClassChange"}
                    ]);
                    // num++;
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

    const onDelete = useCallback((id) => {
        if(id !== "null"){
            setImages((prevState) => prevState.filter((image) => image.id !== id));
            setClasses((prevState) => prevState.filter((classInfo) => classInfo.id !== id));
        }
    }, []);
    
    function changeClass2(e){
        <Route path = "/details" element = {<FileDetails />}/>
        //navigate('/details');
        // <FileDetails courses = {classes} index = {e.target.id} />
        var classNms2 = [];
        for(var i = 0; i < classNms.length; i++){
            if(i == e.target.id){
                classNms2.push({name: "clickedButton"});
            }
            else{
                classNms2.push({name: "buttonForClassChange"});
            }
        }
        setClassNms(classNms2);
        navigate('/details', {state: { courses : classes, index: e.target.id, classNm: classNms2}});
        
    }
    // function getClassNms(e){
    //     var classNms = [];
    //     for(var i = 0; i < classes.length; i++){
    //         if(i == e.target.id){
    //             classNms.push("clickedButton");
    //         }
    //         else{
    //             classNms.push("buttonForClassChange");
    //         }
    //     }
    //     return classNms;
    // }
    return (
        <main className="App">
            <Header/>
                <div className = "fullpage">
                    <div className = "wrapper">
                        {/* <NavBar username = "Abel" items = {classes.map(c => c.course)} changeClass = {changeClass2} />
                         */}
                        <NavBar username = {userName} items = {classes.map(c => c.course)} classNm = {classNms} changeClass = {changeClass2} />
                        <div className = "elements">
                            <Dropzone 
                                onDrop={onDrop} 
                                accept={"application.pdf"} 
                                restrictions={{
                                allowedExtensions: [".pdf"]
                                }}
                            />
                            <ImageGrid images={images} onDelete={onDelete} onNameClick = {changeClass2}/>
                        </div>
                    </div>
                </div>
        </main>
    );
}

export default Home