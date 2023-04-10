import './FileDetails.css';
import React from "react";
import Popup from 'reactjs-popup';
import ReactModal from 'react-modal';
import NavBar from "./NavBar"
import Header from "./components/Header";
import {useLocation} from 'react-router-dom';
import {useEffect, useState, useCallback} from "react";
import TeacherInfo from "./components/TeacherInfo";
import Grades from "./components/Grades";
import GradeDistribution from "./components/GradeDistribution";
import Dates from "./components/Dates";

// class FileDetails extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {classInfo: [], grades: [], numGrades: 0, gradeDistribution: [], dates: []};
//         this.state.classInfo.push({field: 'Name', info: 'Rahul Karthik'});
//         this.state.classInfo.push({field: 'Email', info: 'rk@gmail.com'});
//         this.state.classInfo.push({field: 'Class times', info: 'Tuesday & Thursday, 8:30am - 9:45am'});
//         this.state.classInfo.push({field: 'Office hours', info: '4:00pm - 5:15pm'});
//         this.state.classInfo.push({field: 'Classroom', info: 'ECSS 2.410'});
//         this.state.grades.push([]);
//         this.state.grades.push([]);
//         this.state.grades.push([]);
//         this.state.grades.push([]);
//         this.state.grades.push([]);
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '97-100', grade: 'A+'});
//         this.state.numGrades = this.state.numGrades + 1;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '94-96', grade: 'A'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '90-92', grade: 'A-'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '87-89', grade: 'B+'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '83-86', grade: 'B'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '80-82', grade: 'B-'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '77-79', grade: 'C+'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '73-76', grade: 'C'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '70-72', grade: 'C-'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '67-69', grade: 'D+'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '63-66', grade: 'D'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '60-62', grade: 'D-'});
//         this.state.numGrades++;
//         this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '0-60', grade: 'F'});
//         this.state.numGrades++;

function FileDetails(){
    const {state} = useLocation();
    const {courses, index} = state;
    const [classInfo, setClassInfo] = useState(courses[index].classInfo);
    const [grades, setGrades] = useState(courses[index].grades);
    const [gradeDistribution, setGradeDistribution] = useState(courses[index].gradeDistribution);
    const [dates, setDates] = useState(courses[index].dates);
    const [showPopup, setPopupStatus] = useState(false);
    // this.state = {classInfo: courses[index].classInfo, grades: courses[index].grades, gradeDistribution: courses[index].gradeDistribution, dates: courses[index].dates}
    // setClassInfo(courses[index].classInfo);
    // setGrades(courses[index].grades);
    // setGradeDistribution(courses[index].grades);
    // setDates(courses[index].dates);
    function changeClass(e){
        setClassInfo(courses[e.target.id].classInfo);
        setGrades(courses[e.target.id].grades);
        setGradeDistribution(courses[e.target.id].gradeDistribution);
        setDates(courses[e.target.id].dates);
    }
    function addTeacherInfo(){
        setPopupStatus(!showPopup);
    }
    return(
        <div className="page">
        <Header />
        <div className = "detailComps">
        <NavBar username = "k.rahul287" items = {courses.map(c => c.course)} id="navigationBar" changeClass={changeClass}/>
        <div className = "info">
        <div className = "firstrow">
            <TeacherInfo items={classInfo} addField = {addTeacherInfo}/>
            <ReactModal 
                isOpen = {showPopup}
                contentLabel = "Please Work"
            >
                Please work right now
            </ReactModal>
            <Grades items = {grades} addField = {addTeacherInfo}/>
            
        </div>
        <div className = "secondrow">
            <GradeDistribution items={gradeDistribution} addField = {addTeacherInfo}/>
            <Dates items={dates} addField = {addTeacherInfo}/>
        </div>
        </div>
        </div>
        </div>
    );
}
export default FileDetails;
// class FileDetails extends React.Component{
//     constructor(props){
//         super(props);
//         const {state} = useLocation();
//         const {courses, index} = state;
//         this.state = {classInfo: courses[index].classInfo, grades: courses[index].grades, gradeDistribution: courses[index].gradeDistribution, dates: courses[index].dates}
//         return(
//             <div className="page">
//             <div className = "detailComps">
//             <NavBar username = "k.rahul287" items = {["CS 3345", "CS 3341"]} id="navigationBar" changeClass={this.changeClass}/>
//             <div className = "info">
//             <div className = "firstrow">
//                 <TeacherInfo items={this.state.classInfo} />
//                 <Grades items = {this.state.grades} />
                
//             </div>
//             <div className = "secondrow">
//                 <GradeDistribution items={this.state.gradeDistribution}/>
//                 <Dates items={this.state.dates}/>
//             </div>
//             </div>
//             </div>
//             </div>
//         );
//         // this.state = props.courses[props.index];
//         // this.state = {classInfo: [], grades: [], numGrades: 0, gradeDistribution: [], dates: []};
//         // this.state.classInfo.push({field: 'Name', info: 'Rahul Karthik'});
//         // this.state.classInfo.push({field: 'Email', info: 'rk@gmail.com'});
//         // this.state.classInfo.push({field: 'Class times', info: 'Tuesday & Thursday, 8:30am - 9:45am'});
//         // this.state.classInfo.push({field: 'Office hours', info: '4:00pm - 5:15pm'});
//         // this.state.classInfo.push({field: 'Classroom', info: 'ECSS 2.410'});
//         // this.state.grades.push([]);
//         // this.state.grades.push([]);
//         // this.state.grades.push([]);
//         // this.state.grades.push([]);
//         // this.state.grades.push([]);
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '97-100', grade: 'A+'});
//         // this.state.numGrades = this.state.numGrades + 1;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '94-96', grade: 'A'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '90-92', grade: 'A-'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '87-89', grade: 'B+'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '83-86', grade: 'B'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '80-82', grade: 'B-'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '77-79', grade: 'C+'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '73-76', grade: 'C'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '70-72', grade: 'C-'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '67-69', grade: 'D+'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '63-66', grade: 'D'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '60-62', grade: 'D-'});
//         // this.state.numGrades++;
//         // this.state.grades[Math.floor(this.state.numGrades/3)].push({range: '0-60', grade: 'F'});
//         // this.state.numGrades++;

//         // this.state.gradeDistribution.push({field: 'Homework', weight: '25%'});
//         // this.state.gradeDistribution.push({field: 'Projects', weight: '30%'});
//         // this.state.gradeDistribution.push({field: 'In class assignments', weight: '5%'});
//         // this.state.gradeDistribution.push({field: 'Exams', weight: '40%'});

//         // this.state.dates.push({assigned_date: '01-01-2023', due_date: '01-08-2023', assignment: 'Homework 1'});
//         // this.state.dates.push({assigned_date: '01-08-2023', due_date: '01-15-2023', assignment: 'Homework 2'});
//         // this.state.dates.push({assigned_date: '01-15-2023', due_date: '01-22-2023', assignment: 'Project 1'});
//         // this.state.dates.push({assigned_date: '01-22-2023', due_date: '01-29-2023', assignment: 'Homework 3'});
//         // this.state.dates.push({assigned_date: '01-29-2023', due_date: '02-05-2023', assignment: 'Homework 4'});
//     }
//     populateBlobs = () => {
        
//     }
//     changeClass(){

//     } 
//     render(){
//         return(
//             <div className="page">
//     <div className = "detailComps">
//     <NavBar username = "k.rahul287" items = {["CS 3345", "CS 3341"]} id="navigationBar" changeClass={this.changeClass}/>
//     <div className = "info">
//     <div className = "firstrow">
//         <TeacherInfo items={this.state.classInfo} />
//         <Grades items = {this.state.grades} />
        
//     </div>
//     <div className = "secondrow">
//         <GradeDistribution items={this.state.gradeDistribution}/>
//         <Dates items={this.state.dates}/>
//     </div>
//     </div>
//     </div>
//     </div>
//         );
//     }
// }
// // function FileDetails(){
    
// //     var grades = [];
// //     grades.push([]);
// //     grades.push([]);
// //     grades.push([]);
// //     grades.push([]);
// //     grades.push([]);
// //     grades[0].push({range: '97-100', grade: 'A+'});
// //     grades[0].push({range: '94-96', grade: 'A'});
// //     grades[0].push({range: '90-92', grade: 'A-'});
// //     grades[1].push({range: '87-89', grade: 'B+'});
// //     grades[1].push({range: '83-86', grade: 'B'});
// //     grades[1].push({range: '80-82', grade: 'B-'});
// //     grades[2].push({range: '77-79', grade: 'C+'});
// //     grades[2].push({range: '73-76', grade: 'C'});
// //     grades[2].push({range: '70-72', grade: 'C-'});
// //     grades[3].push({range: '67-69', grade: 'D+'});
// //     grades[3].push({range: '63-66', grade: 'D'});
// //     grades[3].push({range: '60-62', grade: 'D-'});
// //     grades[4].push({range: '0-60', grade: 'F'});
// //     var gradeDistribution = [];
// //     gradeDistribution.push({field: 'Homework', weight: '25%'});
// //     gradeDistribution.push({field: 'Projects', weight: '30%'});
// //     gradeDistribution.push({field: 'In class assignments', weight: '5%'});
// //     gradeDistribution.push({field: 'Exams', weight: '40%'});
// //     var dates = [];
// //     dates.push({assigned_date: '01-01-2023', due_date: '01-08-2023', assignment: 'Homework 1'});
// //     dates.push({assigned_date: '01-08-2023', due_date: '01-15-2023', assignment: 'Homework 2'});
// //     dates.push({assigned_date: '01-15-2023', due_date: '01-22-2023', assignment: 'Project 1'});
// //     dates.push({assigned_date: '01-22-2023', due_date: '01-29-2023', assignment: 'Homework 3'});
// //     dates.push({assigned_date: '01-29-2023', due_date: '02-05-2023', assignment: 'Homework 4'});
// //     // dates.push({date: '02-12-2023', assignment: 'Project 2'});
// //     // dates.push({date: '02-19-2023', assignment: 'Exam 1'});
// //     // dates.push({date: '02-26-2023', assignment: 'Homework 5'});
// //     // dates.push({date: '03-05-2023', assignment: 'Homework 6'});
// //     // dates.push({date: '03-12-2023', assignment: 'Project 3'});
// //     // dates.push({date: '03-19-2023', assignment: 'In class assignment 1'});
// //     // dates.push({date: '03-26-2023', assignment: 'In class assignment 2'});
// //     // dates.push({date: '04-02-2023', assignment: 'Project 3'});
// //     // dates.push({date: '05-01-2023', assignment: 'Exam 2'});
// //     return(
// //         <div className="page">
// //     <div className = "firstrow">
// //         <TeacherInfo name = "Rahul Karthik" email = "karthikrahul444@gmail.com" classTimes = "Tuesday & Thursday, 8:30am - 9:45am" officeHours = "4:00-5:15" classroom = "ECSS 2.410" />
// //         <Grades items = {grades} />
        
// //     </div>
// //     <div className = "secondrow">
// //         <GradeDistribution items={gradeDistribution}/>
// //         <Dates items={dates}/>
// //     </div>
// //     </div>
// //     );
// // }