import "./Header.css";
import React, {useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import logo from './../../syllabyelogo.png';


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
            <a href='http://localhost:3000/home'> <img src={logo}/> </a>
            <nav>
            <button onClick={home} class="headerBtn"> Home </button>
            <button onClick={calendar} class="headerBtn"> Calendar </button>
            <button onClick={logout} class="headerBtn">Logout</button>
            </nav>
        </header>
    )
}
  
  export default Header
  