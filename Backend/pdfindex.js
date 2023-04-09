const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const pdfjsLib = require('pdfjs-dist');
const cors = require('cors');
const jose = require('jose')
const mongoose = require('mongoose')
const User = require('./models/user')
const File = require('./models/file')
require("dotenv").config();
// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
// const openai = new OpenAIApi(configuration);



// const pdf = fs.readFileSync('pdf.json', 'utf8');
// const pdfdata = JSON.parse(pdf);

const app = express();
app.use(express.json());
app.use(cors());

const fs = require('fs');
const { stringify } = require('querystring');
const bodyParser = require('body-parser');

app.use("/", express.static("public"));
app.use(fileUpload());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.mongoURL)

const rmp = {
    name: "",
}

// openai.apiKey = process.env.OPENAI_API_KEY;
// const model = 'davinci';

const pdfdata = {
    professorName: "",
    professorEmail: "",
    professorPhone: "",
    officeLocation: "",
    officeHours: "",
    meetings: "",
    courseNum: "",
    courseName: "",
    term: "",
    grades: [],
    TOC: [],
    calendar: []
};


function findProfessorName(data) {
    const keywords = ["Professor", "professor" , "Name", "name", "Dr."];
    const Xwords = ["Professor Contact Information"];//Excluded words
    const match = data.filter(str => keywords.some(word => str.includes(word) && !str.includes(Xwords)));
    if (match) {
        const Rwords = ["professor", "Name", ":"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        if(Rregex.test(match[0])){
            const name = match[0].replace(Rregex, "").trim();
            return name;
        }
        return match[0];
    }
    return "Professor name not found";
}

async function findProfessorEmail(data, name) {
    const keywords = ["@"];
    const regex = new RegExp(keywords.join("|"), "gi");
    const match = data.find(str => regex.test(str));
    if (match) {
        const Rwords = ["Email Address", "Email", "email", ":"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        if (Rregex.test(match)) {
            const email = match.replace(Rregex, "").trim();
            return email;
        }
        return match;
    }
    else {
        const Rwords = ["Dr.", "Mr.", "Ms.", "Mrs.", "Professor", "professor", "Name", "name"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        const n = name.replace(Rregex, "").trim();
        const prof = n.split(" ");
        const firstName = prof[0];
        const lastName = prof[1];
        const res = await fetch(`https://api.utdnebula.com/professor?first_name=${firstName}&last_name=${lastName}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.NEBULA_API_KEY,
                'Accept': 'application/json',
            },
        })
        const profData = await res.json();
        const email = profData.data[0].email;
        if (email) {
            return email;
        }
        else{
            return "Professor email not found";
        }
    }
}

function findProfessorPhone(data){
    const keywords = ["Phone number", "Office Phone", "Phone", "phone"];
    const match = data.filter(str => keywords.some(word => str.includes(word)));
    if (match) {
        const Rwords = ["Office Phone", "Phone", ":"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        if(Rregex.test(match[0])){
            const phone = match[0].replace(Rregex, "").trim();
            return phone;
        }
        if(match[0]){
            return match[0];
        }
        else{
            return "Professor's phone number not found";
        }
    }
    return "Professor's phone number not found";
}

async function findOfficeLocation(data, name) {
    const Rwords = ["Dr.", "Mr.", "Ms.", "Mrs.", "Professor", "professor", "Name", "name"];//Removed words
    const Rregex = new RegExp(Rwords.join("|"), "gi");
    const n = name.replace(Rregex, "").trim();
    const prof = n.split(" ");
    const firstName = prof[0];
    const lastName = prof[1];
    const res = await fetch(`https://api.utdnebula.com/professor?first_name=${firstName}&last_name=${lastName}`, {
        method: 'GET',
        headers: {
            'x-api-key': process.env.NEBULA_API_KEY,
            'Accept': 'application/json',
        },
    });
    const courseData = await res.json();
    if(courseData.data[0].office){
        const courseName = courseData.data[0].office.building + " " + courseData.data[0].office.room;
        return courseName;
    }
    
    const keywords = ["Office Location", "ECSS", "Office", "office", "Location", "location"];
    const Xwords = ["Meetings", "allocation", "Phone"];//Excluded words
    const Xregex = new RegExp(Xwords.join("|"), "gi");
    const match = data.filter(str => keywords.some(word => str.includes(word) && !Xregex.test(str) && (/\d/).test(str)));
    if (match) {
        const Rwords = ["Office Location", "Office", ":"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        if(Rregex.test(match[0])){
            const location = match[0].replace(Rregex, "").trim();
            return location;
        }
      return match[0];
    }
    return "Office location not found";
}

async function findOfficeHours(data, name) {
    const keywords = ["Office Hours", "office", "hours"];
    const Xwords = ["Meetings"];
    const match = data.filter(str => keywords.some(word => str.includes(word) && !str.includes(Xwords)));
    if (match) {
        const Rwords = ["Office Hours", "Hours"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        if(Rregex.test(match[0])){
            const hours = match[0].replace(Rregex, "").trim();
            return hours;
        }
        return match[0];
    }
    else{
        const Rwords = ["Dr.", "Mr.", "Ms.", "Mrs.", "Professor", "professor", "Name", "name"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        const n = name.replace(Rregex, "").trim();
        const prof = n.split(" ");
        const firstName = prof[0];
        const lastName = prof[1];
        const res = await fetch(`https://api.utdnebula.com/professor?first_name=${firstName}&last_name=${lastName}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.NEBULA_API_KEY,
                'Accept': 'application/json',
            },
        });
        const courseData = await res.json();
        const courseName = courseData.data[0].office_hours;
        if (courseName) {
            return courseName;
        }
        else{
            return "Office hours not found";
        }
    }
}

function findMeetings(data) {
    const keywords = ["PM", "Pm", "pm", "AM", "Am", "am", "Meeting Time", "Meetings", "meetings"];
    const Xwords = ["Office Hours", "Office", "Name", "allocation", "Phone"];//Excluded words
    const match = data.filter(str => keywords.some(word => str.includes(word) && (/\d/).test(str) && !Xwords.some(word => str.includes(word))));
    if (match) {
        const Rwords = ["Meeting Time", "Meetings"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        if(Rregex.test(match[0])){
            const meetings = match[0].replace(Rregex, "").trim();
            return meetings;
        }
        return match[0];
    }
    return "No information about meetings found";
}

function findCourseNum(data) {
    // const keywords = ["Course Number:", "Course Number", "Course", /\d{4,}/];
    const keywords = [/\d{4}\.\d+/];
    const regex = new RegExp(keywords.map(keyword => (typeof keyword === 'string' ? keyword : keyword.source)).join("|"), "gi");
    // const match = data.filter(str => (/\d{4}/).test(str));
    const match = data.filter(str => regex.test(str));
    if (match) {
        const Rwords = ["Course Syllabus", "Course Number", "Course", "Number", ":"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        let number = match[0]
        if(Rregex.test(match[0])){
            number = match[0].replace(Rregex, "").trim();
        }
        if(number.length > 12){
            number = number.substring(0, 12);
        }
        else if(number.length < 10){
            number = number.substring(0, 7);
        }
        return number;
    }
    return "Course number not found";
}

async function findCourseName(course) {
    if(!course) return "Course name not found";
    const val = course.trim().split(" ");
    // console.log(val);
    let num = [];
    let courseNum = "";
    let subject = "";
    if (val.length < 2){
        let Prefix = val[0].split(RegExp(/\d{4}\.\d+/));
        let NUM = course.split(Prefix[0]);
        num = NUM[1].split(".");
        courseNum = num[0];
        subject = Prefix[0];
    }
    else{
        num = val[1].split(".");
        courseNum = num[0];
        subject = val[0];
    }
    
    if (subject.includes("/")){
        const sub = subject.split("/");
        subject = sub[0];
    }

    const res = await fetch(`https://api.utdnebula.com/course?course_number=${courseNum}&subject_prefix=${subject}`, {
        method: 'GET',
        headers: {
            'x-api-key': process.env.NEBULA_API_KEY,
            'Accept': 'application/json',
        },
    });
    const courseData = await res.json();
    const courseName = courseData.data[0].title;
    return courseName;
}  

function findGrades(data){
    const keywords = ["%"];
    const match = data.filter(str => str.includes("%"));
    const Rwords = ['Grade Components:', 'Grade Components', 'Grading Scale:', 'Grading Scale', 'Grades', 'Grade', 'Grading'];
    const Rregex = new RegExp(Rwords.join("|"), "gi");
    if (match) {
        const grades = [];
        for (let i = 0; i < match.length; i++) {
            if(Rregex.test(match[i])){
                match[i] = match[i].replace(Rregex, "").trim();
            }
            const components = match[i].split(/\s+/);
            let s = "";
            let j = 0;
            while (j < components.length) {
                if (j < components.length - 1 && !components[j].includes("%")) {
                    if (s.length == 0) {
                        s += components[j];
                    } else {
                        s += " " + components[j];
                    }
                } else {
                    grades.push(s);
                    grades.push(components[j]);
                }
                j++;
            }
        }
        return grades;
    }
    return "Grades not found";
}

function findTerm(data){
    const keywords = ["Term", "Spring", "Winter", "Summer", "Fall"];
    const regex = new RegExp(keywords.join("|"), "gi");
    const Xwords = ["break"];
    const Xregex = new RegExp(Xwords.join("|"), "gi");
    // const match = data.filter(str => regex.test(str));
    const match = data.filter(str => keywords.some(word => str.includes(word) && !Xregex.test(str)));
    if (match) {
        const Rwords = ["Syllabus UTD", "Syllabus", "UTD", "Term", ":"];//Removed words
        const Rregex = new RegExp(Rwords.join("|"), "gi");
        if(Rregex.test(match[0])){
            const term = match[0].replace(Rregex, "").trim();
            return term;
        }
        return match[0];
    }
    return "Term not found";
}

// async function findCalendar(data, term){
//     const keywords = ["Date"];
//     // const regex = new RegExp(keywords.join("|"), "gi");
//     const Xwords = ["Important", ":", "Post"];
//     const Xregex = new RegExp(Xwords.join("|"), "gi");
//     const match = data.filter(str => keywords.some(word => str.includes(word) && !Xregex.test(str)));
//     const TOC = match[0].split(" ");//Table of Contents
//     console.log(TOC);
//     let s = false;
//     let format = false;
//     let tempData = [];
//     let tempStrData = [];
//     tempStrData.push(match[0]);
//     data.forEach(obj => {
//         if(s){
//             if(obj.includes("_____________________")){
//                 s = false;
//             }
//             // if((obj.includes("/") || obj.includes("Jan ")) && obj.length < 6){
//             //     format = true;
//             // }
//             if(s){
//                 tempStrData.push(obj);
//                 tempData.push(obj.split(" "));
//             }
//         }
//         if(obj == match[0]){
//             s = true;
//         }        
//     });
//     // console.log(TOC + tempStrData);
//     // const Jsontext = JSON.stringify(text, null, 4);
//     // const JD = JSON.parse(Jsontext);
//     const Jtext = JSON.stringify(tempStrData, 4, null);
//     const Jdata = JSON.parse(Jtext)
//     // console.log(Jdata);

//     prompt = (
//         "Create a table of contents with individual sections for each week of the calendar data provided, including the week number, dates, topic, and any assignments for that week. Additionally, create a separate section for exams or tests. If a week includes multiple topics or assignments, please list them all under that week's section. Be sure to include the date and assignment name for each assignment mentioned. Keep the Labels for each thing like Week: __, Date:___, Assignments:___ and more. Do that for one section then make another section for the next week with the same content:\n"
//         + "Data:\n" + Object.values(Jdata).join("\n")
//     )

//     // console.log(prompt);

//     model_engine = "text-ada-001"
//     // model_engine = "code-davinci-001"
//     max_tokens = 500
//     temperature = 0.5
//     n = 1

//     const response = await openai.createCompletion({
//         model: model_engine,
//         prompt: prompt,
//         max_tokens: max_tokens,
//         temperature: temperature,
//         n: n,
//     });

//     const completed_text = await response.data.choices[0].text
//     const test = JSON.stringify(completed_text, 4, null);
//     console.log("Completed Text: " + test + "\n\n\n");
//     console.log("JSON: " + test);
// } //AI Calendar function

async function findCalendar(data, term){
    const keywords = ["Date"];
    // const regex = new RegExp(keywords.join("|"), "gi");
    const Xwords = ["Important", ":", "Post"];
    const Xregex = new RegExp(Xwords.join("|"), "gi");
    const match = data.filter(str => keywords.some(word => str.includes(word) && !Xregex.test(str)));
    const TOC = match[0].split(" ");//Table of Contents
    // console.log(TOC);
    pdfdata.TOC = TOC;
    let s = false;
    let format = false;
    let tempData = [];
    let tempStrData = [];
    // tempStrData.push(match[0]);
    data.forEach(obj => {
        if(s){
            if(obj.includes("_____________________")){
                s = false;
            }
            // if((obj.includes("/") || obj.includes("Jan ")) && obj.length < 6){
            //     format = true;
            // }
            if(s){
                tempStrData.push(obj);
                tempData.push(obj.split(" "));
            }
        }
        if(obj == match[0]){
            s = true;
        }        
    });
        // console.log(tempStrData);
        let Weekcounter = 1;
        let row = [];
        let str = "";
        for(let i = 0; i < tempStrData.length; i++){
            if(((tempStrData[i][0] == Weekcounter.toString() || (tempStrData[i][0] + tempStrData[i][1]) == Weekcounter.toString()))){ //Maybe want to check if that value doesnt have "/" as it could mean theirs no weeks
                                                                                                                                      // and instead its just dates
                Weekcounter++;
                if(str != ("")){
                    row.push(str.trim());
                }

                if(tempStrData[i][tempStrData[i].length - 1] != (" ")){
                    str = tempStrData[i] + " ";
                }
                else{
                    str = tempStrData[i];
                }
            }
            else{
                if(i == tempStrData.length - 1){
                    str += tempStrData[i];
                    row.push(str.trim());
                }
                if(tempStrData[i][tempStrData[i].length - 1] != (" ")){
                    str += tempStrData[i] + " ";
                }
                else{
                    str += tempStrData[i];
                }
            }
        }
        // console.log("Built data set:");
        // console.log(row);

        const set = [];
        let tempWeek = "";
        let tempDate = [];
        let tempTopic = "";
        let tempReading = [];
        let tempAssignment = [];
        let tempImportant = [];
        let dateStatus = false;
        const dateKeywords = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const ReadingKeywords = ["Chapter", "Chapters", "Chp.", "Chp", "Ch.", "Ch", "chp.", "chp", "ch.", "ch", "Appendix", "Appendices", "appendix", "appendices", "Reading", "Readings", "reading", "readings"];
        const Reading2ndKeywords = ["Chp.", "Ch.", "A.", "chp.", "ch.", "a."];
        const AssignmentKeywords = ["Assignment", "Assignments", "assignment", "assignments", "Homework", "homework", "HW", "hw"];
        const ImportantKeywords = ["Exams", "Exam", "Tests", "Test", "Midterms", "Midterm", "Finals", "Final", "exams", "exam", "tests", "test", "midterms", "midterm", "finals", "final"];
        const TopicKeywords = ["Review", "review"];
        const X2Words = ["TBA", "--"]
        //Add case sensitivity .toLowerCase() later

        console.log("Parsing data set:\n");
        for(let i = 0; i < row.length; i++){
            const temp = row[i].split(" ");
            if(RegExp(/\d/).test(temp[0])){
                if(!temp[0].includes("/")){
                    tempWeek = temp[0];
                    for(let j = 1; j < temp.length; j++){
                        if((temp[j].includes("/") && RegExp(/\d/).test(temp[j])) || dateKeywords.some(word => (temp[j] == word))){
                            dateStatus = true;
                            if(temp[j].includes("/")){// Dates that are 01/30
                                if(ImportantKeywords.some(word => temp[j+1].includes(word))){ // 01/30 Exams
                                    if(RegExp(/\d/).test(temp[j+1])){ // 01/30 Exams1
                                        tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1]);
                                        j++;
                                    }
                                    else if (j+2 < temp.length){ // 01/30 Exams 1
                                        if(RegExp(/\d/).test(temp[j+2])){
                                            tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1] + " " + temp[j+2]);
                                            j+=2;
                                        }
                                    }
                                    else{ // 01/30 Exams
                                        tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1]);
                                        j++;
                                    }
                                }
                                else{ // 01/30
                                    tempDate.push(temp[j].replace(",", "").trim());
                                }
                            }
                            else{// Dates that are Jan 30 or Jan30
                                if(RegExp(/\d/).test(temp[j])){ //Jan30
                                    if(ImportantKeywords.some(word => temp[j+1].includes(word))){ //Jan30 Exams
                                        if(RegExp(/\d/).test(temp[j+1])){ //Jan30 Exams1
                                            if(j+2 < temp.length){
                                                if(TopicKeywords.some(word => temp[j+2].equals(word))){ //Jan30 Exams1 Review
                                                    tempDate.push(temp[j].trim());
                                                    if(tempTopic != ("")){
                                                        tempTopic += " " + temp[j+1] + " " + temp[j+2];
                                                    }
                                                    else{
                                                        tempTopic = temp[j+1] + " " + temp[j+2];
                                                    }
                                                    j+=2;
                                                }
                                                else{ //Jan30 Exams1
                                                    tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1]);
                                                    j++;
                                                }
                                            }
                                            else{ //Jan30 Exams1
                                                tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1]);
                                                j++;
                                            }
                                        }
                                        else if (j+2 < temp.length){ //Jan30 Exams ...
                                            if(RegExp(/\d/).test(temp[j+2])){ //Jan30 Exams 1
                                                if(j+3 < temp.length){
                                                    if(TopicKeywords.some(word => temp[j+3].equals(word))){ //Jan30 Exams 1 Review
                                                        tempDate.push(temp[j].trim());
                                                        if(tempTopic != ("")){
                                                            tempTopic += " " + temp[j+1] + " " + temp[j+2] + " " + temp[j+3];
                                                        }
                                                        else{
                                                            tempTopic = temp[j+1] + " " + temp[j+2] + " " + temp[j+3];
                                                        }
                                                        j+=3;
                                                    }
                                                    else{ //Jan30 Exams 1
                                                        tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1] + " " + temp[j+2]);
                                                        j+=2;
                                                    }
                                                }
                                                else{ //Jan30 Exams 1
                                                    tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1] + " " + temp[j+2]);
                                                    j+=2;
                                                }
                                            }
                                            else{ //Jan30 Exams (no ...)
                                                tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1]);
                                                j++;
                                            }
                                        }
                                        else{ //Jan30 Exams
                                            tempImportant.push(temp[j].replace(":", "").trim() + " | " + temp[j+1]);
                                            j++;
                                        }
                                    }
                                    else{ //Jan30
                                        tempDate[tempWeek.length - 1] += " | " + temp[j];
                                    }
                                }
                                else{ //Jan 30
                                    if(ImportantKeywords.some(word => temp[j+2].includes(word))){ //Jan 30 Exams
                                        if(RegExp(/\d/).test(temp[j+2])){ //Jan 30 Exams1
                                            if(j+3 < temp.length){ //Jan 30 Exams1 ...
                                                if(TopicKeywords.some(word => temp[j+3].equals(word))){ //Jan 30 Exams1 Review
                                                    tempDate.push(temp[j].trim() + " " + temp[j+1]);
                                                    if(tempTopic != ("")){
                                                        tempTopic += " " + temp[j+2] + " " + temp[j+3];
                                                    }
                                                    else{
                                                        tempTopic = temp[j+2] + " " + temp[j+3];
                                                    }
                                                    j+=3;
                                                }
                                                else{ //Jan 30 Exams1
                                                    tempImportant.push(temp[j].replace(":", "").trim() + " " + temp[j+1] + " | " + temp[j+2]);
                                                    j+=2;
                                                }
                                            }
                                            else{ //Jan 30 Exams1
                                                tempImportant.push(temp[j].replace(":", "").trim() + " " + temp[j+1] + " | " + temp[j+2]);
                                                j+=2;
                                            }
                                        }
                                        else if (j+3 < temp.length){ //Jan 30 Exams ...
                                            if(RegExp(/\d/).test(temp[j+3])){ //Jan 30 Exams 1
                                                if(j+4 < temp.length){
                                                    if(TopicKeywords.some(word => (temp[j+4] == word))){ //Jan 30 Exams 1 Review
                                                        tempDate.push(temp[j].trim() + " " + temp[j+1]);
                                                        if(tempTopic != ("")){
                                                            tempTopic += " " + temp[j+2] + " " + temp[j+3] + " " + temp[j+4];
                                                        }
                                                        else{
                                                            tempTopic = temp[j+2] + " " + temp[j+3] + " " + temp[j+4];
                                                        }
                                                        j+=4;
                                                    }
                                                    else{ //Jan 30 Exams 1
                                                        tempImportant.push(temp[j].replace(":", "").trim() + " " + temp[j+1] + " | " + temp[j+2] + " " + temp[j+3]);
                                                        j+=3;
                                                    }
                                                }
                                                else{ //Jan 30 Exams 1
                                                    tempImportant.push(temp[j].replace(":", "").trim() + " " + temp[j+1] + " | " + temp[j+2] + " " + temp[j+3]);
                                                    j+=3;
                                                }
                                            }
                                            else{ //Jan 30 Exams (no ...)
                                                tempImportant.push(temp[j].replace(":", "").trim() + " " + temp[j+1] + " | " + temp[j+2]);
                                                j+=2;
                                            }
                                        }
                                        else{ //Jan 30 Exams
                                            tempImportant.push(temp[j].replace(":", "").trim() + " " + temp[j+1] + " | " + temp[j+2]);
                                            j+=2;
                                        }
                                    }
                                    else{ //Jan 30
                                        tempDate.push(temp[j].trim() + " " + temp[j+1]);
                                        j++;
                                    }
                                }
                            }
                        }
                        else if(ReadingKeywords.some(word => (temp[j] == word)) || Reading2ndKeywords.some(word2 => temp[j].includes(word2))){ // Chapter/Reading/Appendix
                            if(RegExp(/\d/).test(temp[j])){ //Chp.1
                                if(temp[j].includes(",")){ //Chp.1,
                                    if(j+1 < temp.length){
                                        if(RegExp(/\d/).test(temp[j+1]) && !Reading2ndKeywords.some(word2 => temp[j+1].includes(word2))){ //Chp.1, 2
                                            tempReading.push(temp[j].replace(",", "").trim() + " " + temp[j+1].replace(",", "").trim());
                                            j++;
                                        }
                                        else{
                                            tempReading.push(temp[j].replace(",", "").trim());
                                        }
                                    }
                                    else{
                                        tempReading.push(temp[j].replace(",", "").trim());
                                    }
                                }
                                else{
                                    tempReading.push(temp[j].replace(",", "").trim());
                                }
                            }
                            else if(j+1 < temp.length){ //Chp. ...
                                if(RegExp(/\d/).test(temp[j+1])){ //Chp. 1
                                    if(temp[j+1].includes(",")){ //Chp. 1,
                                        if(j+2 < temp.length){
                                            if(RegExp(/\d/).test(temp[j+2]) && !Reading2ndKeywords.some(word2 => temp[j+2].includes(word2))){ //Chp. 1, 2
                                                tempReading.push(temp[j].replace(",", "").trim() + " " + temp[j+1].replace(",", "").trim() + ", " + temp[j+2].replace(",", "").trim());
                                                j+=2;
                                            }
                                            else{ //Chp. 1, 2
                                                tempReading.push(temp[j].replace(",", "").trim() + " " + temp[j+1].replace(",", "").trim());
                                                j++;
                                            }
                                        }
                                        else{
                                            tempReading.push(temp[j].replace(",", "").trim() + " " + temp[j+1].replace(",", "").trim());
                                            j++;
                                        }
                                    }
                                    else{
                                        tempReading.push(temp[j].replace(",", "").trim() + " " + temp[j+1].replace(",", "").trim());
                                        j++;
                                    }
                                }
                                else{
                                    if(temp[j+1].length == 1 && !RegExp(/\d/).test(temp[j+1])){ //Appendix A
                                        tempReading.push(temp[j].replace(",", "").trim() + " " + temp[j+1].replace(",", "").trim());
                                        j++;
                                    }
                                    else{
                                        tempReading.push(temp[j].replace(",", "").trim());
                                    }
                                }
                            }
                            else{
                                tempReading.push(temp[j].replace(",", "").trim());
                            }
                        }
                        else if(AssignmentKeywords.some(word => (temp[j] == word))){
                            if(RegExp(/\d/).test(temp[j])){
                                tempAssignment.push(temp[j]);
                            }
                            else if(j+1 < temp.length){
                                if(RegExp(/\d/).test(temp[j+1])){
                                    tempAssignment.push(temp[j] + " " + temp[j+1]);
                                    j++;
                                }
                                else{
                                    tempAssignment.push(temp[j]);
                                }
                            }
                        }
                        else if(ImportantKeywords.some(word => temp[j].includes(word))){
                            if(RegExp(/\d/).test(temp[j])){ //Test1
                                tempImportant.push(temp[j]);
                            }
                            else if(j+1 < temp.length){ //Test ...
                                if(RegExp(/\d/).test(temp[j+1])){ //Test 1
                                    tempImportant.push(temp[j].replace(",", "").trim() + " " + temp[j+1].replace(",", "").trim());
                                    j++;
                                }
                                else{
                                    tempImportant.push(temp[j].replace(",", "").trim());
                                }
                            }

                            if(row[i].includes("TBA")){ //Test 3 -- TBA
                                tempImportant[tempImportant.length - 1] += " -- " + "TBA";
                            }
                        }
                        else{
                            if(!X2Words.some(word => (temp[j] == word))){
                                if(dateStatus){
                                    dateStatus = false;
                                    if(tempTopic != ""){
                                        tempTopic += " | " + temp[j];
                                    }
                                    else{
                                        tempTopic = temp[j];
                                    }
                                }
                                else{
                                    if(tempTopic != ""){
                                        tempTopic += " " + temp[j];
                                    }
                                    else{
                                        tempTopic = temp[j];
                                    }
                                }
                            }
                        }
                    }
                }
                // else{
                //     for(let j = 0; j < temp.length; j++){
                //     }
                // }
            }
            if(tempWeek == ""){
                tempWeek = "None";
            }
            if(tempDate.length == 0){
                tempDate.push("None");
            }
            if(tempTopic == ""){
                tempTopic = "None";
            }
            if(tempReading.length == 0){
                tempReading.push("None");
            }
            if(tempAssignment.length == 0){
                tempAssignment.push("None");
            }
            if(tempImportant.length == 0){
                tempImportant.push("None");
            }
            set.push({
                week: tempWeek,
                date: tempDate,
                topic: tempTopic,
                reading: tempReading,
                assignment: tempAssignment,
                important: tempImportant
            })
            tempWeek = "";
            tempDate = [];
            tempTopic = "";
            tempReading = [];
            tempAssignment = [];
            tempImportant = [];
        }
    pdfdata.calendar = set;
    // console.log(set);
    return set;
}

app.post("/extract-text", async (req, res) => {
    try{
        if (!req.files && !req.files.pdfFile) {
            res.status(400)
            res.end()
        }
    }
    catch(err){
        console.log(err)
    }
    
    let val = await pdfParse(req.files.pdfFile);
    let first = (val.text).split("\n");
    let second = first.filter((element) => { return element.trim() != "" });
    let text = second.map((element) => { return element.trim() });
    const Jsontext = JSON.stringify(text, null, 4);
    const JD = JSON.parse(Jsontext);
    // fs.writeFileSync("pdf3.json", Jsontext);

    let professornName = findProfessorName(JD);
    pdfdata.professorName = professornName;
    pdfdata.professorEmail = await findProfessorEmail(JD, professornName);
    pdfdata.professorPhone = findProfessorPhone(JD);
    pdfdata.officeLocation = await findOfficeLocation(JD, professornName);
    pdfdata.officeHours = await findOfficeHours(JD, professornName);
    pdfdata.meetings = findMeetings(JD);
    let courseNum = findCourseNum(JD);
    pdfdata.courseNum = courseNum;
    pdfdata.courseName = await findCourseName(courseNum);
    pdfdata.term = findTerm(JD);
    pdfdata.grades = findGrades(JD);
    pdfdata.calendar = await findCalendar(JD, pdfdata.term);
    //test
    // console.log("Professor Name:", professorName);
    // console.log("Professor Email:", professorEmail);
    // console.log("Office Location:", officeLocation);
    // console.log("Office Hours:", officeHours);
    // console.log("Meetings:", meetings);
    // console.log("Course Number:", courseNum);
    // console.log("Grades:", grades);
    // console.log("Term:", term);//
    // console.log("Calendar:", calendar);
    // console.log(pdfdata);
    // console.log(pdfdata.calendar);
    console.log(pdfdata);
    res.send(pdfdata);
});

app.listen(1338, () => {
    console.log('Server started');
});