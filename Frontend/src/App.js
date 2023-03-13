import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import Login from './pages/Login'
import Register from './pages/Register'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
//import Dashboard from './pages/Dashboard'

const App = () => {
    return(
        <div>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path ="/login" element={<Login />} />
                    <Route path ="/welcome" element = {<Welcome />} />
                    {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;