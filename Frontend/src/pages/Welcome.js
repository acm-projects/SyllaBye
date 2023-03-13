import './Welcome.css';
//import { Box } from '@mui/material';

function Welcome() {
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
          <label for="signinField" id="signin">Welcome to Syllabye</label>
          <p for="welcoming" id = "welcomeMessage">The web app that will organize your classes for you. Sign up to get started.</p>
          <div className = "Buttons">
            <button type="button" id="signinButton">Sign in</button>
            <button type="button" id="signupButton">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
