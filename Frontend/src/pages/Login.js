import './Login.css';
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from './../syllabyelogo.png';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// import jwt_decode from 'jwt-decode';

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // const handleSuccess = (response) => {
    //     // Store the authentication information in a cookie or local storage
    //     navigate('/home');
    // };

    // const handleError = (error) => {
    //     console.error('Authentication error:', error);
    // };

    function handleRegisterAsk(e){
        e.preventDefault();
        navigate('/register');
    }

    async function loginUser(event) {
        event.preventDefault()

        const response = await fetch('http://localhost:1337/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            }),
        })
        
        const data = await response.json();
        
        if(data.user){
            localStorage.setItem('token', data.user)
            navigate('/home')
        }
        else{
            //add error message
        }
    }

    return (
        <div className="App2">
            <header className="App-header2">
                <div className = "nameEnc2">
                    <label for="nameField2" id="name2"><img src={logo}/></label>
                </div>
            </header>
            <div className = "Form2">
                <div className = "RealForm2">
                    <form onSubmit = {loginUser}>
                        <label for="signinField" id="signin">Sign In</label>
                        <label for="personNameField" class = "labels2" id = "personName">Username</label>
                        <input 
                            class="inputs2"
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                            type="text"  
                        />
                        <br />
                        <label for="passwordField" class = "labels2" id = "password">Password </label>
                        {/* <br /> */}
                        <input 
                            class="inputs2"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            type="text"  
                        />
                        <br />
                        <input id="signinButton" type="submit" value="Sign In"/>
                        <br />
                        <p id = "noAccount">Don't have an account?</p>
                        <br />
                        <input id="signupButton2" type="submit" value="Sign Up" onClick={handleRegisterAsk}/>
                    </form>
                    {/* <GoogleOAuthProvider clientId="436198478288-32tmdiqkg6t268a0i7hpagokfgt0e2eo.apps.googleusercontent.com">
                        <GoogleLogin
                            className="google-login"
                            onSuccess={handleSuccess}
                            onFailure={handleError}
                        />
                    </GoogleOAuthProvider>' */}
                </div>
            </div>
        </div>
    );
}

export default Login;