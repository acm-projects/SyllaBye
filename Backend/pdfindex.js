const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const pdfjsLib = require('pdfjs-dist');

// const pdf = fs.readFileSync('pdf.json', 'utf8');
// const pdfdata = JSON.parse(pdf);

const app = express();

const fs = require('fs');

// let text = "test\ning"

// let p = text.split("\n");

// console.log(p);

//For multer: https://www.section.io/engineering-education/uploading-files-using-multer-nodejs/

app.use("/", express.static("public"));
app.use(fileUpload());

// console.log("test")


app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400)
        res.end();
    }

    // const p = req.files.pdfFile;

    // pdfjsLib.getDocument(p).promise.then(function (doc) {
    //     for(let i = 1; i < doc.numPages; i++){
    //         doc.getPage(i).then(function (page) {
    //             page.getTextContent().then(function (textContent) {
    //                 let formattedText = '';
    //                 let lastDate = '';
                    
    //                 // Loop through each item in the text content
    //                 for (let i = 0; i < textContent.items.length; i++) {
    //                   let item = textContent.items[i];
    //                   let text = item.str;
                      
    //                   // Check if the current item matches the date pattern (MM/DD)
    //                   if (RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])").test(text)) {
                        
    //                     // If it does, add a new line and update the last date variable
    //                     formattedText += '\n' + text + ' ';
    //                     lastDate = text;
    //                   } else {
                        
    //                     // If it doesn't, add the text to the current line and include the last date variable
    //                     formattedText += text;
    //                   }
    //                 }
                    
    //                 console.log(formattedText);
    //               });
    //         });
    //     }
    // });

    // pdfjsLib.getDocument(p).promise.then(function (doc) {
    //     let totalPages = doc.numPages;
    //     let pagesProcessed = 0;
    //     let pdftext = [];
    
    //     for (let i = 1; i <= totalPages; i++) {
    //         doc.getPage(i).then(function (page) {
    //             page.getTextContent().then(function (textContent) {
    //                 let text = textContent.items.map(function (s) { return s.str; }).join('');
    //                 text = text.split('\n').filter(Boolean);
    //                 text.forEach(element => {
    //                     const val = element.toLowerCase();
    //                     if (/\d{4,}/.test(val)) {
    //                         if (val.includes("course number")) {
    //                             const coursenum = val.replace("course number: ", "");
    //                             pdftext.push(coursenum);
    //                         }
    //                     }
    //                     else if (RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])").test(val)) {
    //                         pdftext.push(val);
    //                     }
    //                 });
    //                 pagesProcessed++;
    //                 if (pagesProcessed === totalPages) {
    //                     let formattedText = pdftext.join('\n');
    //                     console.log(formattedText);
    //                 }
    //             });
    //         });
    //     }
    //     console.log(pdftext);
    // });
    

    pdfParse(req.files.pdfFile).then(data => {
        let first = (data.text).split("\n");
        let second = first.filter((element) => { return element.trim() != "" });
        let text = second.map((element) => { return element.trim() });


        const Jsontext = JSON.stringify(text, null, 4);


        
        fs.writeFile("pdf2.json", Jsontext, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("File written successfully");
            }
        });
        // fs.writeFile("pdf3.json", JSON.stringify(first, null, 4), (err) => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log("File written successfully");
        //     }
        // });

        const pdftext = [];
        let status = false;
        let status2 = false;
        let datecounter = 0;
        let counter = 0;
        const arr = [];
        text.forEach(element => {
            arr.push(element);
            counter++;

            const val = element.toLowerCase();
            if (/\d{4,}/.test(val)) {
                // pdftext.push(val);
                if(val.includes("course number")){
                    const coursenum = val.replace("course number: ", "");
                    pdftext.push(coursenum);
                }
            }
            if (RegExp("(?<month>[0-3]?[0-9])/(?<day>[0-3]?[0-9])").test(val) && !val.includes("24/7")) {
                if (datecounter == 0){
                    let tableofcontents = arr[counter-2].split(" ");
                    console.log(tableofcontents);
                    // console.log(arr[counter-2]);
                    // pdftext.push(val);
                    // datecounter++;
                    datecounter++;
                }
                //Look at page 260 in REGEX textbook for this regex expression
            }
            if (status == false) {
                if (val.includes("course number:")) {
                    const coursenum = val.replace("course number: ", "");
                    pdftext.push(coursenum);
                }
                else if (val.includes("course title:")) {
                    const coursetitle = val.replace("course title: ", "");
                    pdftext.push(coursetitle);
                }
                if (val.includes("calendar")){
                    status = true;
                }
                if (val.includes("%")){
                    pdftext.push(val);
                }
            }
            else{
                if (/\d/.test(val)){
                    status2 = true;
                    pdftext.push(val);
                }
                else if (status2 == true){
                    status = false;
                }
            }
            
        });
        console.log(pdftext);

        // let p = (data.text).split("\n");
        // console.log(p);

        //console.log(data.text);
        //console.log(Object.keys(data.text));
        
        var str;
        var test = new Array();
        // if (data.text.includes("Course Number:")){
        //     console.log("found");
        //     var num = data.text.indexOf("Course Number:");
        //     console.log(num);

        //     console.log(data.text[num + ("Course Number:").length]);
        // }
        // console.log("done");
        //console.log(data);

                    // Object.keys(data.text).forEach(element => {
                    //     console.log(element + " - " + data.text[element]);
                    //     // if(data.text[element] != " "){
                    //     //     str += data.text[element];
                    //     // }
                    //     // else{
                    //     //     //console.log(str);
                    //     //     test.push(str);
                    //     //     //console.log(test)
                    //     //     //console.log(str);
                    //     //     str = "";
                    //     // }
                    // });

                    //     // console.log(element + " - " + data.text[element]);
                    //     // //console.log("huh: " + element);
                    //     // //console.log(element.text);
                    //     // if (element.objType === "Text") {
                    //     //     if (element.text.includes("Course Number:")){
                    //     //         console.log(element.text);
                    //     //     }
                    //     //     else{
                    //     //         console.log("nope");
                    //     //     }
                    //     // }
                    //     console.log(data);
                        
                    // });
                    // test.forEach(item => {
                    //     //console.log(item);
                    //     if(item == "Course"){
                    //         console.log("found");
                    //         console.log(item);
                    //     }
                    // })
                    // if(test.includes('Course')){
                    //     //console.log("found");
                    //     //console.log(test);
                    // }
                    // console.log("done");
        // Object.keys(data.text).forEach(element => {
        //     console.log("huh: " + element);
        //     Object.keys(element).forEach(item => {
        //         console.log(item);
        //         if (item.objType === "Text") {
        //             if (item.text.includes("Course Number:")){
        //                 console.log(item.text);
        //             }
        //         }
        //     });
        // });
        // data.text.forEach(element => {
        //     element.forEach(element => {
        //         if (element.objType === "Text") {
        //             if (element.text.includes("Course Number:")){
        //                 console.log(element.text);
        //             }
        //         }
        //     });
        // });
    });
});



app.listen(1337, () => {
    console.log('Server started');
});