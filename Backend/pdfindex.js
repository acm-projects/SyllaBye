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


// const pdf = fs.readFileSync('pdf.json', 'utf8');
// const pdfdata = JSON.parse(pdf);

const app = express();
app.use(express.json());
app.use(cors());

const fs = require('fs');
const date1 = RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])");

app.use("/", express.static("public"));
app.use(fileUpload());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.mongoURL)

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

function findCalendar(data, term){
    const keywords = ["Date"];
    // const regex = new RegExp(keywords.join("|"), "gi");
    const Xwords = ["Important", ":", "Post"];
    const Xregex = new RegExp(Xwords.join("|"), "gi");
    const match = data.filter(str => keywords.some(word => str.includes(word) && !Xregex.test(str)));
    const TOC = match[0].split(" ");//Table of Contents
    console.log(TOC);
    let s = false;
    let tempData = [];
    data.forEach(obj => {
        if(s){
            tempData.push(obj.split(" "));
        }
        if(obj == match[0]){
            s = true;
        }        
    });
    console.log(tempData);
    let week = [];
    let date = [];
    let topic = [];
    let assignment = [];
    
    if(TOC.includes("Week") || TOC.includes("week") || TOC.includes("WEEK")){
        for (let i = 0; i < tempData.length; i++) {
            if(!tempData[i][0].includes("/") && (/\d/).test(tempData[i][0])){
                week.push(tempData[i][0]);
            }
        }
        console.log(week);
    }

    if(TOC.includes("Date") || TOC.includes("date") || TOC.includes("DATE")){
        for (let i = 0; i < tempData.length; i++) {
            let str = [];
            for (let j = 0; j < tempData[i].length; j++) {
                if(tempData[i][j].includes("/")){
                    str.push(tempData[i][j].replace(",", "").replace(":", "").replace(";", "").trim());
                }
            }
            if(str.length > 0){
                date.push(str);
            }
        }
        console.log(date);
    }

    if(TOC.includes("Topic") || TOC.includes("topic") || TOC.includes("TOPIC")){
        for (let i = 0; i < date.length; i++) {
            let str = "";
            for (let j = 0; j < tempData[i].length; j++) {
                if(j == 0 && (/\d/).test(tempData[i][j])){
                    continue;
                }
                if(tempData.includes("Assignment") || tempData.includes("Chapter")){
                    break;
                }
                else if(!tempData[i][j].includes("/") && !tempData[i][j].includes("Assignment")){
                    str += (tempData[i][j].replace(",", "").replace(":", "").replace(";", "").trim()) + " ";
                }
            }
            if(str.length > 0){
                topic.push(str.trim());
            }
            else{
                topic.push("None");
            }
        }
        console.log(topic);
    }

    if(TOC.includes("Assignment") || TOC.includes("Assignments") || TOC.includes("assignment") || TOC.includes("ASSIGNMENT")){
        let current = -1;
        for (let i = 0; i < tempData.length; i++) {
            let str = "";
            let status = false;
            let status2 = false;
            for (let j = 0; j < tempData[i].length; j++) {
                if(tempData[i][j].includes("Assignment")){
                    status = true;
                }
                if(status){
                    str += (tempData[i][j].replace(",", "").replace(":", "").replace(";", "").trim()) + " ";
                }
                if(tempData[i][j].includes("/")){
                    status2 = true;
                }
            }
            if(str.length > 0){
                if(status2){
                    assignment.push(str.trim());
                    current++;
                }
                else{
                    assignment[current] = str.trim();
                }

                // if(!tempData[i].includes("/")){
                //     assignment[current] = str.trim();
                // }
                // else{
                //     assignment.push(str.trim());
                //     current++; 
                // }
            }
            else{
                assignment.push("None");
                current++;
            }
        }
        console.log(assignment);
    }

    // const testmatch = data.filter(str => RegExp(/^(\d+)\s+([\d/ ,]+)\s+(.+?)\s*Assignment\s*(\d*)$/).test(str));
    // console.log(testmatch);


    
    //Maybe use a 2D array where arr[0][1..n] stores the table of contents for example 
    // arr[0][1] = "Week" and arr[0][2] = "Date" and so on. We first find the table of contents, split 
    // the content and then input each element into arr[0][n] next we take each string and search for 
    // values or something based off each arr[0][n] and then input in arr[n][m] where n is the value 
    // it matches like week is in n=1 so arr[1][m] is where we store the data relating to it. Also lets 
    // setup functions for if we come accross numbers and convert them to numbers. BTW some lines may not 
    // include any of the table of content so we input the value for that content null meaning topic or 
    // chapter or something wasnt given and continue on. What we are basically doing is that m is for 
    // the line we are currently at on the pdf json file.


    if(term.includes("Spring")){
        const month = 5;
        const day = 12;
    }

    let status = false;
    data.forEach(element => {
        if(keywords.some(word => element.includes(word) && !Xregex.test(element))){
            status = true;
        }
        else if(status == true){
//     //                     else if (RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])").test(val)) {

            if (RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])").test(element)){
                const date = element.match(RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])"));
                // const val = date.split(RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])"));
                // console.log("test");
                // if(date.includes("/")){
                //     const val = date.split(RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])"));
                //     console.log("test");
                // }
            }
            // console.log(element);
        }
    });
    // const match = data.filter(str => keywords.some(word => str.includes(word) && !Xregex.test(str)));

    // const match = data.filter(str => regex.test(str));
    // const Rwords = ["Important", ":"];//Removed words
    // const Rregex = new RegExp(Rwords.join("|"), "gi");
    // const val = match.filter(str => str.includes());
    // console.log(match);//
}

app.post("/extract-text", async (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }

    let val = await pdfParse(req.files.pdfFile);
    let first = (val.text).split("\n");
    let second = first.filter((element) => { return element.trim() != "" });
    let text = second.map((element) => { return element.trim() });
    const Jsontext = JSON.stringify(text, null, 4);
    const JD = JSON.parse(Jsontext);
    // fs.writeFileSync("pdf2.json", Jsontext);

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

    const token = req.headers['x-access-token'];
    try{
        const {payload, protectedHeader} = jwt.verify(token, process.env.JWTKey)
        const userEmail = payload.email
        
        await File.create({
            email: userEmail,
            fileData: pdfdata
        })
    }
    catch(err){
        console.log(err)
    }

    const calendar = findCalendar(JD, pdfdata.term);//

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
    res.send(pdfdata);
});

app.listen(1337, () => {
    console.log('Server started');
});