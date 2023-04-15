import { React, useEffect, useState } from 'react';
import Header from "./components/Header";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { gapi } from 'gapi-script';

const CalendarPg = () => {
    var CLIENT_ID = "436198478288-32tmdiqkg6t268a0i7hpagokfgt0e2eo.apps.googleusercontent.com";
    var API_KEY = "AIzaSyDa5yff8QIDY9dgLuT8ZAlfJBbheJ7dAto";
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.events";

    useEffect(() => {
        gapi.load('client:auth2', () => {
            console.log('loaded client')

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            gapi.client.load('calendar', 'v3', () => console.log('bam!'))

            gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
                try{
                    const userProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                    const userEmail = userProfile.getEmail();
                    let calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=" + userEmail + "&ctz=America%2FCentral";
                    const calendarFrame = document.createElement('iframe');
                    calendarFrame.setAttribute('src', calendarEmbedUrl);
                    calendarFrame.setAttribute('style', 'border-width:0; width:40%; height:60vh; framework:0');
                    document.getElementById('calendar-container').appendChild(calendarFrame);
                }
                catch(err){
                    console.log(err)
                }
            })
        })
    }, [])


    const handleClick = () => {
        console.log(gapi);
        const temp = []
        const ev = []
        gapi.load('client:auth2', async () => {
          console.log('loaded client')
    
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
    
            gapi.client.load('calendar', 'v3', () => console.log('Success!'))

            const files = fetch("http://localhost:1337/api/files", {
            method: "GET",
            headers: {"x-access-token" : localStorage.getItem("token"),},
            }).then((res) => {
                return res.json()
            }).then((res) => {
                res.forEach((file) => {
                    temp.push(file.fileData.calendar);
                })
            });
            for (let i = 0; i < temp.length; i++) {
                if ((temp[i].assignment[0] != "None" || temp[i].important[0] != "None") && temp[i].date[0] != "None") {
                    if(temp[i].assignment[0] != "None"){
                        ev.push({
                            'summary': 'assignment',
                            'start':{
                                'dateTime': 'current year + (date.split("/")[0] + date.split("/")[1])',
                            }
                        })
                    }
                }
            }

            // console.log(file.fileData.calendar);

            // ev.push({
            //     //if no assignment or important then dont add date
            //     'summary': 'assignment',
            //     'start':{
            //         'dateTime': 'current year + (date.split("/")[0] + date.split("/")[1])',
            //     }
            // }


            var event = {
                'summary': 'Awesome Event!',
                'location': '800 Howard St., San Francisco, CA 94103',
                'description': 'Really great refreshments',
                'start': {
                    'dateTime': '2023-04-12T09:00:00-07:00',
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': '2023-04-13T17:00:00-07:00',
                    'timeZone': 'America/Los_Angeles'
                },
                'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': [//Might not need this but this is an example of how to add attendees
                    {'email': 'lpage@example.com'},
                    {'email': 'sbrin@example.com'}
                ],
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10}
                    ]
                }
            }

            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
            })
            
            request.execute(event => {
                console.log(event);
            })

            try{
                const userProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                const userEmail = userProfile.getEmail();
                let calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=" + userEmail + "&ctz=America%2FCentral";
                const calendarFrame = document.createElement('iframe');
                calendarFrame.setAttribute('src', calendarEmbedUrl);
                calendarFrame.setAttribute('style', 'border-width:0; width:40%; height:60vh; framework:0');
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