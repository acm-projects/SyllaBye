import "./Header.css";
import React, {useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import longLogo from './../../syllabyelogo.png';
import miniLogo from './../../miniLogo.png';


const Header = () => {

    const navigate = useNavigate()

    async function logout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    async function home() {
        navigate('/home')
    }

    async function calendar() {
        window.location.replace("http://localhost:3000/calendar")
    }

    return (

        <header>
            <a href='http://localhost:3000/home'> <img className="miniLogo" src={miniLogo}/> </a>
            <a > <img className="longLogo" src={longLogo}/> </a>
            <nav>
            <button onClick={calendar} class="headerBtn"> Calendar </button>
            <button onClick={logout} class="headerBtn">Logout</button>
            </nav>
        </header>
    )
}
  
  export default Header