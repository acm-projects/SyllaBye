import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Welcome from './pages/Welcome'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import FileDetails from './pages/FileDetails'
import CalendarPg from './pages/CalendarPg'


const App = () => {
    return(
        <div>
            <Router>
                <Routes>
                    <Route path ="/" element = {<Welcome />} />
                    <Route path="/register" element={<Register />} />
                    <Route path ="/login" element={<Login />} />
                    <Route path ="/home" element={<Home />} />
                    <Route path="/details" element={<FileDetails />}/>
                    <Route path="/calendar" element={<CalendarPg />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;