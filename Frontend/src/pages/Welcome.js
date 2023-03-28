import './Welcome.css';
import {useNavigate} from 'react-router-dom'

//import { Box } from '@mui/material';

function Welcome() {
    const navigate = useNavigate()

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
                </div>
            </div>
        </div>
    );
}

export default Welcome;
