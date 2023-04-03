import './Welcome.css';
import {useNavigate} from 'react-router-dom';

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
                    <label id="name3">Syllabye</label>
                </div>
            </header>
            <div className = "Form3">
                <div className = "RealForm3">
                    <label id="signin2">Welcome to Syllabye</label>
                    <p id = "welcomeMessage">The web app that will organize your classes for you. Sign up to get started.</p>
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