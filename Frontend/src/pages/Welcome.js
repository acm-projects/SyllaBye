import './Welcome.css';
import {useNavigate} from 'react-router-dom';
import logo from './../syllabyelogo.png';
//import { Box } from '@mui/material';

function Welcome() {
    const navigate = useNavigate()

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
                <label for="nameField3" id="name3"><img src={logo}/></label>
            </div>
        </header>
        <div className = "Form3">
            <div className = "RealForm3">
                <label for="signinField" id="signin2">Welcome to Syllabye</label>
                <p for="welcoming" id = "welcomeMessage">The web app that will organize your classes for you. Sign up to get started.</p>
                <div className = "Buttons">
                    <input id="signinButton2" type="submit" value="Sign In" onClick={handleLoginAsk}/>
                    <input id="signupButton3" type="submit" value="Sign Up" onClick={handleRegisterAsk}/>
                </div>
            </div>
        </div>
    </div> 
    );
}

export default Welcome;
