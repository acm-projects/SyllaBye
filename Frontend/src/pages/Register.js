import './Register.css';
//import { Box } from '@mui/material';

function Register() {
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
          <label for="signupField" id="signup">Sign Up</label>
          <label for="personNameField" class = "labels" id = "personName">Name</label>
          <input class="inputs" type="text" name="nameP"/>
          <label for="emailField" class = "labels" id = "email">Email</label>
          <input class="inputs" type="text" name="nameP"/>
          <label for="passwordField" class = "labels" id = "password">Password</label>
          <input class="inputs" type="password" name="nameP"/>
          <label for="verifypwField" class = "labels" id = "verifypw">Verify password</label>
          <input class="inputs" type="password" name="nameP"/>
          <button type="button" id="signupButton">Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
