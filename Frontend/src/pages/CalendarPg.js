import { React, useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

function CalendarPg() {
    var CLIENT_ID
    var API_KEY
    var DISCOVERY_DOCS
    var SCOPES

    const res = fetch("http://localhost:1337/api/google-auth-keys", {
        method: "GET",
    }).then((res) => res.json()
    ).then((res) => {
        CLIENT_ID = res.CLIENT_ID
        API_KEY = res.API_KEY
        DISCOVERY_DOCS = res.DISCOVERY_DOCS
        SCOPES = res.SCOPES
    });

    useEffect(() => {
        gapi.load('client:auth2', () => {
            console.log('loaded client')

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOCS],
                scope: SCOPES,
            })

            gapi.client.load('calendar', 'v3', () => console.log('bam!'))

            console.log("GAPI:" + gapi)
            
            console.log(gapi.client.calendars)

            // const request = gapi.client.calendars.events.list({
            //     calendarId: 'primary',
            //     timeMin: (new Date()).toISOString(),
            //     showDeleted: false,
            //     singleEvents: true,
            //     maxResults: 10,
            //     orderBy: 'startTime',
            // })
            
            // request.execute(event => {
            //     const calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=" + event.result.items[0].creator.email + "&ctz=America%2FNew_York";
            //     const calendarFrame = document.createElement('iframe');
            //     calendarFrame.setAttribute('src', calendarEmbedUrl);
            //     calendarFrame.setAttribute('style', 'border-width:0; width:40%; height:60vh; framework:0');
            //     document.getElementById('calendar-container').appendChild(calendarFrame);
            // })
        })
    }, [])


    const handleClick = () => {
        console.log(gapi);
        gapi.load('client:auth2', () => {
          console.log('loaded client')
    
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOCS],
                scope: SCOPES,
            })
    
            gapi.client.load('calendar', 'v3', () => console.log('bam!'))

            gapi.auth2.getAuthInstance().signIn()
            .then(() => {
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

                // request.execute(event => {
                //     console.log(event)
                // //   window.open(event.htmlLink) //This will open Google Calendar in a new tab and will disaply new events
                // })

                request.execute(event => {
                    // console.log(event)
                    // const calendarEmbedUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent('primary')}&ctz=${encodeURIComponent('America/Los_Angeles')}`;
                    // const calendarFrame = document.createElement('iframe');
                    // calendarFrame.setAttribute('src', calendarEmbedUrl);
                    // calendarFrame.setAttribute('style', 'border-width:0; width:40%; height:60vh; framework:0;');
                    // document.getElementById('calendar-container').appendChild(calendarFrame);
                })
            })
        })
    }
    return (
        <div>
            {/* <GoogleOAuthProvider clientId="436198478288-32tmdiqkg6t268a0i7hpagokfgt0e2eo.apps.googleusercontent.com">
//                 <GoogleLogin
//                     onSuccess={(credentialResponse) => {
//                         const token_details = jwt_decode(credentialResponse.credential);
//                         console.log(token_details);
//                         console.log(credentialResponse);
//                         // console.log("new line");
//                         // console.log(window.gapi);
//                     }}
//                     onError={() => {
//                         console.log('Login Failed');
//                     }}
//                 />
//             </GoogleOAuthProvider> */} {/*Probably wont need but come back to this if needed*/}       
            <button onClick={handleClick}>Click</button>
            <div id="calendar-container"></div>
        </div>
    )
}

export default CalendarPg;