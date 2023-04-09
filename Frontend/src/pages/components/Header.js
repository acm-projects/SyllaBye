import "./Header.css";
import * as jose from 'jose';
import React, {useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import logo from './../../syllabyelogo.png';


const Header = () => {

  const navigate = useNavigate()

  async function logout() {
//      localStorage.removeItem('token')
//      navigate('/login')
  }

//  useEffect(() => {
//      const token = localStorage.getItem('token')
//      if(token){
//          const user = jose.decodeJwt(token)
//          if(!user){
//              localStorage.removeItem('token')
//              navigate('/login')
//          }
//          else{
//              //
//          }
//      }
//      else{
//          navigate('/login')
//      }
//  }, [])




    return (
      <header>
        <img src={logo}/>
        <nav>
          <button class="headerBtn"> Home </button>
          <button onClick={logout} class="headerBtn">Logout</button>
        </nav>
      </header>
    )
  }
  
  export default Header
  