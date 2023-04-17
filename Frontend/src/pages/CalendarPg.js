import { React, useEffect, useState } from 'react';
import Header from "./components/Header";
import { gapi } from 'gapi-script';

function CalendarPg() {
    var CLIENT_ID
    var API_KEY
    var DISCOVERY_DOCS
    var SCOPES
    var calendarID
    const dateKeywords = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const res = fetch("http://localhost:1337/api/google-auth-keys", {
        method: "GET",
    }).then((res) => res.json()
    ).then((res) => {
        CLIENT_ID = res.CLIENT_ID
        API_KEY = res.API_KEY
        DISCOVERY_DOCS = res.DISCOVERY_DOCS
        SCOPES = res.SCOPES
    });

    // const Cres = fetch("http://localhost:1337/api/getCalendarID", {
    //     method: "GET",
    //     headers: {"x-access-token" : localStorage.getItem("token"),},
    // }).then((res) => res.json()
    // ).then((res) => {
    //     calendarID = res.calendarID
    // });

    useEffect(() => {
        gapi.load('client:auth2', async () => {
            console.log('loaded client')

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOCS],
                scope: SCOPES,
            })

            gapi.client.load('calendar', 'v3', () => console.log('bam!'))

            const cres = await fetch("http://localhost:1337/api/getCalendarID", {
                method: "GET",
                headers: {"x-access-token" : localStorage.getItem("token"),},
            })
            const cdata = await cres.json();
            calendarID = cdata.calendarID

            if (calendarID == null) {
                gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
                    try{
                        const userProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                        const userEmail = userProfile.getEmail();
                        let calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=" + userEmail + "&ctz=America%2FCentral";
                        const calendarFrame = document.createElement('iframe');
                        calendarFrame.setAttribute('src', calendarEmbedUrl);
                        calendarFrame.setAttribute('style', 'border-width:0; width:100vw; height:100vh; framework:0');
                        document.getElementById('calendar-container').appendChild(calendarFrame);
                    }
                    catch(err){
                        console.log(err)
                    }
                })
            }
            else{
                gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
                    try{
                        const userProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                        const userEmail = userProfile.getEmail();
                        let calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=" + userEmail  + "&src=" + calendarID + "&ctz=America%2FCentral";
                        const calendarFrame = document.createElement('iframe');
                        calendarFrame.setAttribute('src', calendarEmbedUrl);
                        calendarFrame.setAttribute('style', 'border-width:0; width:100vw; height:100vh; framework:0');
                        document.getElementById('calendar-container').appendChild(calendarFrame);
                    }
                    catch(err){
                        console.log(err)
                    }
                })
            }
        })
    }, [])

    const handleClick = () => {
        console.log(gapi);
        const temp = []
        const year = []
        const ev = []
        const name = []
        var syllabyeCalendarId = ""
        gapi.load('client:auth2', async () => {
          console.log('loaded client')
    
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOCS],
                scope: SCOPES,
            })
    
            gapi.client.load('calendar', 'v3', () => console.log('Success!'))

            var req = gapi.client.calendar.calendarList.list({});

            if (calendarID == null) {
                req.execute(function(resp) {
                    console.log(resp);
                    var status = false;
                    for (var i = 0; i < resp.items.length; i++) {
                        if (resp.items[i].summary == "Syllabye") {
                            status = true;
                        }
                    }

                    if (status == false) {
                        var request = gapi.client.calendar.calendars.insert({
                            'summary': 'Syllabye',
                            'timeZone': 'America/Chicago',
                        });
                        request.execute(function(calendar) {
                            console.log(calendar);
                        });
                    }
                });

                var request = await gapi.client.calendar.calendarList.list();
                const calendars = request.result.items;
                const syllabyeCalendar = calendars.find(calendar => calendar.summary === 'Syllabye');
                syllabyeCalendarId = syllabyeCalendar.id;

                fetch("http://localhost:1337/api/postCalendarID", {
                    method: "POST",
                    headers: {
                        "x-access-token" : localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        calendarID: syllabyeCalendarId,
                    })
                })

                calendarID = syllabyeCalendarId
            }

            const files = await fetch("http://localhost:1337/api/files", {
                method: "GET",
                headers: {"x-access-token" : localStorage.getItem("token"),},
            })

            const filesJson = await files.json()
            filesJson.forEach((file) => {
                name.push(file.fileData.courseNum);
                temp.push(file.fileData.calendar);
                let term = file.fileData.term;
                year.push(term.split(" ")[1]);
            })

            // console.log(temp)
            for (let i = 0; i < temp.length; i++) {
                for (let j = 0; j < temp[i].length; j++) {
                    if ((temp[i][j].assignment[0] != "None" || temp[i][j].important[0] != "None") && temp[i][j].date[0] != "None") {
                        if(temp[i][j].important[0] != "None"){
                            let month = "";
                            let day = "";
                            if(temp[i][j].important[0].includes(" | ")){
                                let important = temp[i][j].important[0].split(" | ");
                                if(important[0].includes("/")){
                                    month = important[0].split("/")[0];
                                    day = important[0].split("/")[1];
                                    if (month.length == 1) {
                                        month = "0" + month;
                                    }
                                    if (day.length == 1) {
                                        day = "0" + day;
                                    }
                                }
                                else{
                                    for(let k = 0; k < dateKeywords.length; k++){
                                        if(important[0].includes(dateKeywords[k])){
                                            month = (k + 1).toString();
                                            day = important[0].split(" ")[1];
                                            if (month.length == 1) {
                                                month = "0" + month;
                                            }
                                            if (day.length == 1) {
                                                day = "0" + day;
                                            }
                                        }
                                    }
                                }
                                ev.push({
                                    'summary': name[i] + " " + important[1],
                                    'start':{
                                        'date': year[i]+"-"+month+"-"+day,
                                        'timeZone': 'America/Chicago'
                                    },
                                    'end':{
                                        'date': year[i]+"-"+month+"-"+day,
                                        'timeZone': 'America/Chicago'
                                    },
                                    'reminders': {
                                        'useDefault': false,
                                        'overrides': [
                                            {'method': 'email', 'minutes': 24 * 60},
                                            {'method': 'popup', 'minutes': 10}
                                        ]
                                    }
                                })
                            }
                            else{
                                let d = temp[i][j].date[temp[i][j].date.length - 1]
                                if(d.includes("/")){
                                    month = d.split("/")[0];
                                    day = d.split("/")[1];
                                    if (month.length == 1) {
                                        month = "0" + month;
                                    }
                                    if (day.length == 1) {
                                        day = "0" + day;
                                    }
                                }
                                else{
                                    for(let k = 0; k < dateKeywords.length; k++){
                                        if(d.includes(dateKeywords[k])){
                                            month = (k + 1).toString();
                                            day = d.split(" ")[1];
                                            if (month.length == 1) {
                                                month = "0" + month;
                                            }
                                            if (day.length == 1) {
                                                day = "0" + day;
                                            }
                                        }
                                    }
                                }
                                ev.push({
                                    'summary': name[i] + " " + temp[i][j].important[0],
                                    'start':{
                                        'date': year[i]+"-"+month+"-"+day,
                                        'timeZone': 'America/Chicago'
                                    },
                                    'end':{
                                        'date': year[i]+"-"+month+"-"+day,
                                        'timeZone': 'America/Chicago'
                                    },
                                    'reminders': {
                                        'useDefault': false,
                                        'overrides': [
                                            {'method': 'email', 'minutes': 24 * 60},
                                            {'method': 'popup', 'minutes': 10}
                                        ]
                                    }
                                })
                            }
                        }
                        if(temp[i][j].assignment[0] != "None"){
                            let month = ""
                            let day = ""
                            let d = temp[i][j].date[temp[i][j].date.length - 1]
                            if(d.includes("/")){
                                month = d.split("/")[0];
                                day = d.split("/")[1];
                                if (month.length == 1) {
                                    month = "0" + month;
                                }
                                if (day.length == 1) {
                                    day = "0" + day;
                                }
                            }
                            else{
                                for(let k = 0; k < dateKeywords.length; k++){
                                    if(d.includes(dateKeywords[k])){
                                        month = (k + 1).toString();
                                        day = d.split(" ")[1];
                                        if (month.length == 1) {
                                            month = "0" + month;
                                        }
                                        if (day.length == 1) {
                                            day = "0" + day;
                                        }
                                    }
                                }
                            }
                            ev.push({
                                'summary': name[i] + " " + temp[i][j].assignment[0],
                                'start':{
                                    'date': year[i]+"-"+month+"-"+day,
                                    'timeZone': 'America/Chicago'
                                },
                                'end':{
                                    'date': year[i]+"-"+month+"-"+day,
                                    'timeZone': 'America/Chicago'
                                },
                                'reminders': {
                                    'useDefault': false,
                                    'overrides': [
                                        {'method': 'email', 'minutes': 24 * 60},
                                        {'method': 'popup', 'minutes': 10}
                                    ]
                                }
                            })
                        }
                    }
                }
            }

            var currentYear = new Date().getFullYear();
            var beginningOfYear = new Date(currentYear, 0, 1); // January 1st of current year
            var time = beginningOfYear.toISOString();


            var request = gapi.client.calendar.events.list({
                'calendarId': calendarID,
                'timeMin': time,
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 100,
                'orderBy': 'startTime'
            })

            request.execute( (resp) => {
                var events = resp.items;
                var batch = gapi.client.newBatch();

                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                        for (var j = 0; j < ev.length; j++) {
                            if (ev[j].summary == (event.summary) && ev[j].start.date == (event.start.date)) {
                                ev.splice(j, 1);
                                break;
                            }
                        }
                    }
                }

                for (var i = 0; i < ev.length; i++) {
                    batch.add(gapi.client.calendar.events.insert({
                        'calendarId': calendarID,
                        'resource': ev[i]
                    }));
                }
            
                batch.execute(function(resp, raw) {
                    console.log(resp);
                });
            })

            try{
                const userProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                const userEmail = userProfile.getEmail();
                let calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=" + userEmail  + "&src=" + calendarID + "&ctz=America%2FCentral";
                const calendarFrame = document.createElement('iframe');
                calendarFrame.setAttribute('src', calendarEmbedUrl);
                calendarFrame.setAttribute('style', 'border-width:0; width:100vw; height:100vh; framework:0');
                const oldCalendarFrame = document.getElementById('calendar-container').getElementsByTagName('iframe')[0];
                oldCalendarFrame.parentNode.removeChild(oldCalendarFrame);
                document.getElementById('calendar-container').appendChild(calendarFrame);
            }
            catch(err){
                console.log(err)
            }
        })
    }
    return (
        <main>
            <Header/>
            <div>  
                <button onClick={handleClick}>Click</button>
                <div id="calendar-container"></div>
            </div>
        </main>
    )
}

export default CalendarPg;