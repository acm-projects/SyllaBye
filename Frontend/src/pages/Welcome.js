import './Welcome.css';
//import { Box } from '@mui/material';

function Welcome() {
  return (
    <div className="App">
        <header className="App-header">
            <div className = "nameEnc">
                <label for="nameField" id="name">Syllabye</label>
            </div>
        </header>
        <div className = "Form">
            <div className = "RealForm">
                <label for="signinField" id="signin">Welcome to Syllabye</label>
                <p for="welcoming" id = "welcomeMessage">The web app that will organize your classes for you. Sign up to get started.</p>
                <div className = "Buttons">
                    <input type="submit" value="Sign In"/>
                    <input type="submit" value="Sign Up"/>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Welcome;
