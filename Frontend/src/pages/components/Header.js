import "./Header.css";
import React, {useEffect} from "react";
import {useNavigate} from 'react-router-dom'


const Header = () => {

    const navigate = useNavigate()

    async function logout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <header>
            <h1>SyllaBye</h1>
            <nav>
                <button className="headerBtn"> Home </button>
                <button className="headerBtn"> Calendar </button>
                <button className="headerBtn"> Settings </button>
                <button onClick={logout} class="headerBtn">Logout</button>
                <button class="headerBtn"> Home </button>
            </nav>
        </header>
    )
}
  
  export default Header
  