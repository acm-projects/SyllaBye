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

            gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
                const request = gapi.client.calendar.events.list({
                    calendarId: 'primary',
                    timeMin: (new Date()).toISOString(),
                    showDeleted: false,
                    singleEvents: true,
                    maxResults: 10,
                    orderBy: 'startTime',
                })

                request.execute(event => {
                    const calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=" + event.result.items[0].creator.email + "&ctz=America%2FNew_York";
                    const calendarFrame = document.createElement('iframe');
                    calendarFrame.setAttribute('src', calendarEmbedUrl);
                    calendarFrame.setAttribute('style', 'border-width:0; width:40%; height:60vh; framework:0');
                    document.getElementById('calendar-container').appendChild(calendarFrame);
                })
            })
        })
    }, [])

    return (
        <div id="calendar-container"></div>
    )
}

export default CalendarPg;