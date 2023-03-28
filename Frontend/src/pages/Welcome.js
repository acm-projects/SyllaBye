import './Welcome.css';
<<<<<<< HEAD
import {useNavigate} from 'react-router-dom'

=======
import {useNavigate} from 'react-router-dom';
>>>>>>> 1a6603eedd4b6d7fd81c1603f2c63966672e116e
//import { Box } from '@mui/material';

function Welcome() {
    const navigate = useNavigate()

<<<<<<< HEAD
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
                        <input
                            type="submit"
                            value="Sign In"
                            onClick={() => navigate('/login')}
                        />
                        <input
                            type="submit"
                            value="Sign Up"
                            onClick={() => navigate('/register')}
                        />
                    </div>
=======
    function handleLoginAsk(e){
        e.preventDefault();
        navigate('/login');
    }

    function handleRegisterAsk(e){
        e.preventDefault();
        navigate('/register');
    }
    
  return (
    <div className="App3">
        <header className="App-header3">
            <div className = "nameEnc3">
                <label for="nameField3" id="name3">Syllabye</label>
            </div>
        </header>
        <div className = "Form3">
            <div className = "RealForm3">
                <label for="signinField" id="signin2">Welcome to Syllabye</label>
                <p for="welcoming" id = "welcomeMessage">The web app that will organize your classes for you. Sign up to get started.</p>
                <div className = "Buttons">
                    <input id="signinButton2" type="submit" value="Sign In" onClick={handleLoginAsk}/>
                    <input id="signupButton3" type="submit" value="Sign Up" onClick={handleRegisterAsk}/>
>>>>>>> 1a6603eedd4b6d7fd81c1603f2c63966672e116e
                </div>
            </div>
        </div>
    );
}

export default Welcome;
