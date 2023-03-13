import './Login.css';
//import { Box } from '@mui/material';

function Login() {
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
          <label for="personNameField" class = "labels2" id = "personName">Username</label>
          <input class ="inputs2" type="text" name="nameP"/>
          <label for="passwordField" class = "labels2" id = "password">Password</label>
          <input class ="inputs2" type="password" name="nameP"/>
          <button type="button" class="signinButton">Sign in</button>
          <p id = "noAccount">Don't have an account?</p>
          <button type="button" class="signupButton">Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
