import './Login.css';
//import { Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loginUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json();
    console.log(data);

    if(data.user){
      localStorage.setItem('token', data.user)
      alert('Login successful')
      navigate('/dashboard')
    }
    else{
      alert('Please check your username and password')
    }
    console.log(data);
  }


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */
        <div className = "nameEnc">
          <label for="nameField" id="name">Syllabye</label>
          </div>
        }
      </header>
      <div className = "Form">
        <div className = "RealForm">
          <label for="signinField" id="signin">Sign In</label>
          
          {/* <input class ="inputs2" type="text" name="nameP"/> */}
          {/* <input class ="inputs2" type="password" name="nameP"/> */}
          {/* <button type="button" class="signinButton">Sign in</button> */}
          
          {/* <button type="button" class="signupButton">Sign up</button> */}
          {/* <h1>Login</h1> */}
          <form onSubmit={loginUser}>
          <label for="personNameField" class = "labels2" id = "personName">Username</label>
            <input
              class = "inputs2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
            />
            <br />
          <label for="passwordField" class = "labels2" id = "password">Password</label>
            <input
              class = "inputs2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <br />
            <input class = "signinButton" type="submit" value="Login" />
            <p id = "noAccount">Don't have an account?</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
