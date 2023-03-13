const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

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

app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400)
        res.end();
    }

    pdfParse(req.files.pdfFile).then(data => {
        // console.log(typeof data);
        let first = (data.text).split("\n");
        let second = first.filter((element) => { return element.trim() != "" });
        let text = second.map((element) => { return element.trim() });

        //let text = p.map((element) => { return element.trim() });
        const Jsontext = JSON.stringify(text, null, 4);
        //If it doesnt split all the "" as well as other things that are needed, 
        // then make a function that takes each inputs and check 
        // to see if valid if not then dont push to array, if valid then push. 
        // This way only valid datat will be stored in the array and it can be represented in the JSON file.

        fs.writeFile("pdf2.json", Jsontext, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("File written successfully");
            }
        });

        const pdftext = [];
        let status = false;
        let status2 = false;
        text.forEach(element => {
            const val = element.toLowerCase();
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



app.listen(3000, () => {
    console.log('Server started');
});