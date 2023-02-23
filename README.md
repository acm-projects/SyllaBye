#  SyllaBye 📝
Have you ever felt overwhelmed by all the syllabi being thrown at you the first week of classes? Do you hate having to go through 10 pages of a syllabus to find the information that really matters? SyllaBye allows you to upload pdfs of your syllabi and extracts the key information found in every syllabus. From grade information to how many tests, SyllaBye allows you to know what you need to know without all the other fluff! Say goodbye to syllabi and hello to SyllaBye.

## MVP

 - User account with user authentication
 - Upload page where you can upload a syllabus
 - Original Syllabus page:
	 - See all original syllabi in pdf form
- Condensed Syllabus page:
	- View all extracted information
	- Easy-to-read format
	- Sort syllabi alphabetically, custom order, etc.
- Extracted Information:
	- Grade information
	- Test information
	- Office hours
	- Sentiment analysis for strictness of professor

## Stretch Goals
-   Implementation of the RateMyProf API to provide further insight into a user’s syllabus:
	- https://github.com/tisuela/ratemyprof-api
-   Social aspect that allows you to find other people with the same class
-   Implementation of Google Calendar API the to take events from syllabi and insert them onto a user’s calendar OR local calendar system with reminders
	- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview) 

## Milestones
 **Week 1**
- Meet team, decide frontend/backend teams, set up development environment, finalize tech stack

**Week 2**
- Flesh out collective vision for the app
- Frontend:
	-	Create wireframes for UI in Figma/AdobeXD
	-	Learn basics of ReactJS
- Backend:
	- Plan out database design schema
	- Learn basics of MERN Stack (MongoDB, NodeJS, Express)

**Weeks 3/4**
- Backend and frontend communication to ensure cohesive application
- Frontend: 
	- Finalize UI Design
	- Code initial screens
		- Login/Create and Account screen
		- Upload Syllabus screen
		- Original Syllabus screen
	- Research how to upload pdfs in ReactJS
- Backend:
	- Set up user authentication
	- Set up database to store user information and syllabus objects
    

**Weeks 5/6**
- Backend and frontend communication to start integrating backend with frontend
- Frontend: 
	- Finish screens:
	- Condensed Syllabus Page w/ key information
	- Implement ability to upload pdfs of syllabi
- Backend:
	- Implement NPM library to extract key information from syllabi
	- Ensure extraction algorithm will work for all syllabus formats
    

**Weeks 7/8**
- Backend and frontend communication to finish integrating backend with frontend to connect and test
- If far along enough, start working on stretch goals:
	- Color & Theme change based on user preference OR
	- RateMy Prof API implementation in some way OR
	- Social aspect
 - Frontend:
	- Polish up MVP features and help backend if needed
- Backend
	- Finish up key information extraction algorithm
	- Add in sentiment analysis for syllabi
    
**Weeks 9/10**
- Prepare for presentation
- Polish app so it is presentation ready




## Tech Stack

**Overall MERN Stack:** [MERN Stack Course](https://www.youtube.com/watch?v=mrHNSanmqQ4&t=0s)


**Front-End: React**
- [What is React?](https://www.youtube.com/watch?v=Tn6-PIqc4UM)
-   Tons of javascript libraries that you can use for a variety of purposes, can have better performance since you can pick and choose what needs to be there for the application, widely used in the industry.
-   [How to Install React on Windows - Getting Started](https://www.youtube.com/watch?v=IbWXHfz91_Y)
-   Resources:
	-   [Learn React In 30 Minutes](https://www.youtube.com/watch?v=hQAHSlTtcmY)
	-   [React File Uploader With Express (Using React Hooks)](https://www.youtube.com/watch?v=b6Oe2puTdMQ)
	-   [React Documentation](https://reactjs.org/)
	-   [React js Tutorial - How To Get Data From An API With React](https://www.youtube.com/watch?v=hzLDsxPGctY)
	-   [How to upload and view pdf files in reactjs](https://www.youtube.com/watch?v=v-PoG1X8jig)
	-   [PDF JS (alternative method to get PDF text)](https://mozilla.github.io/pdf.js/examples/#hello-world-using-base64-encoded-pdf)
    
**Back-End: MongoDB + Express + NodeJS**
-   Widely used
-   Has a package manager with libraries that are useful
-   Integrates easily with React as the MERN stack
-   Resources:
	-   [Build A REST API With Node.js, Express, & MongoDB - Quick](https://www.youtube.com/watch?v=fgTGADljAeg&t=181s)
	-   [MERN Stack Full Tutorial | User authentication, JWT, Node.js, MongoDB, React and more](https://www.youtube.com/watch?v=Ejg7es3ba2k)
	-   [How to Extract Text from a PDF Document Using JavaScript & Express.js](https://www.youtube.com/watch?v=enfZAaTRTKU)
	-   [File Uploading to MongoDB](https://www.freecodecamp.org/news/gridfs-making-file-uploading-to-mongodb/)
	-   [File Upload Setup - Node.js/Express/MongoDB Course #4](https://www.youtube.com/watch?v=Xm5MzWvklbI)
	-   [Extracting text from pdf using NodeJS (seems pretty helpful)](https://hippreacher.hashnode.dev/how-to-extract-text-content-from-pdf-using-nodejs-5-easy-steps)
    

**-   APIs**
-   [Rate My Prof](https://github.com/tisuela/ratemyprof-api)
-   [How To Use The Google Calendar API In Node.js](https://www.youtube.com/watch?v=zrLf4KMs71E)
-   [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
-   [Text Sentiment Analysis](https://medium.com/@RapidAPI/how-to-create-a-text-sentiment-analysis-app-using-react-eaf1de68860b)

## Software to Install
-   [Git](https://git-scm.com/downloads)
-   [Visual Studio Code](https://code.visualstudio.com/)
-   [React](https://reactjs.org/docs/create-a-new-react-app.html)
-   [Node js](https://nodejs.org/en/)
-   [MongoDB Atlas](https://www.mongodb.com/try/download/community)

## Other Resources
-   [Git cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf)
-   [Git in-depth tutorial](https://youtu.be/RGOj5yH7evk)
-   [Postman set up tutorial](https://youtu.be/3eHJkcA8mTs)    
-   Sharing any graphics using [Box](https://utdallas.account.box.com/login)  
-   Sign up for [Figma](https://www.figma.com/signup)  
-   [Wireframe design inspiration](https://dribbble.com/shots/popular/web-design)  
-   Resources to make presentations:
-   [Pitch](https://pitch.com/) (more “professional” templates)

## Team SyllaBye
**Developers:**
- Clara Conner
- Abel Thomas
- Rahul Karthik
- Ansh Naikele: Backend

**Industry Mentor:**
- Sean Hassan

**Project Manager:**
- Karina Batra
