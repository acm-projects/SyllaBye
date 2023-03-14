import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
import FileDetails from './pages/FileDetails'
const App = () => {
    return(
        <div>
            <Router>
                <Routes>
                    <Route path ="/" element = {<Welcome />} />
                    <Route path="/register" element={<Register />} />
                    <Route path ="/login" element={<Login />} />
                    <Route path="/details" element={<FileDetails />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;