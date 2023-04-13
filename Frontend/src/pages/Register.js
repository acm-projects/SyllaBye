import './Register.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from './../syllabyelogo.png';
import { gapi } from 'gapi-script';


function Register() {
    var CLIENT_ID = "436198478288-32tmdiqkg6t268a0i7hpagokfgt0e2eo.apps.googleusercontent.com";
    var API_KEY = "AIzaSyDa5yff8QIDY9dgLuT8ZAlfJBbheJ7dAto";
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.events";
    
    const navigate = useNavigate()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [vPassword, setVPassword] = useState('');

    function handleLoginAsk(e){
        e.preventDefault();
        navigate('/login');
    }

    async function registeredUser(event) {
        event.preventDefault()

        const response = await fetch('http://localhost:1337/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            }),
        })

        const data = await response.json();

        if(data.status === 'ok'){
            navigate('/login')
        }
    }

    async function googleAuth() {
        gapi.load('client:auth2', async () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            const googleToken = await gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
            const googleUser = await gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
            console.log(googleToken);
            console.log(googleUser);

            const response = await fetch('http://localhost:1337/api/google-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: googleToken,
                    name: googleUser.getName(),
                    email: googleUser.getEmail()
                })
            })
            
            const data = await response.json()
        
            if(data.status === 'ok'){
                localStorage.setItem('token', googleToken);
                navigate('/home')
            }
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className = "nameEnc">
                    <label for="nameField" id="name"><img src={logo}/></label>
                </div>
            </header>
            <div className = "Form">
                <div className = "RealForm">
                    <label for="signupField" id="signup">Sign Up</label>
                    <label for="personNameField" class = "labels" id = "personName">Name</label>
                    <form onSubmit = {registeredUser}>
                        <input
                            class = "inputs"
                            value = {name}
                            onChange = {(e) => setName(e.target.value)}
                            type="text"  
                        />
                        <br />
                        <label for="emailField" class = "labels" id = "email">Email</label>
                        <input 
                            class = "inputs"
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                            type="text"  
                        />
                        <br />
                        <label for="passwordField" class = "labels" id = "password">Password</label>
                        {/* <br /> */}
                        <input 
                            class = "inputs"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            type="password"  
                        />
                        <br />
                        <label for="verifypwField" class = "labels" id = "verifypw">Verify password</label>
                        {/* <br /> */}
                        <input 
                            class = "inputs"
                            value = {vPassword}
                            onChange = {(e) => setVPassword(e.target.value)}
                            type="password"  
                        />
                        <br />
                        <input id="signupButton" type="submit" value="Sign Up"/>
                        <button id="googleAuthButton" onClick={googleAuth} style={{
                            background: 'white',
                            color: 'rgba(0, 0, 0, .54)',
                            boxShadow: '0 3px 4px 0 rgba(0, 0, 0, .25)',
                            borderRadius: '2px',
                            border: 'solid 1px rgba(0, 0, 0, .12)',
                            fontWeight: '500',
                            fontSize: '14px',
                            height: '36px',
                            width: '200px',
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            margin: '16px 0',
                        }}>
                            <img
                                src="https://developers.google.com/identity/images/g-logo.png"
                                alt="Google Logo"
                                style={{ marginRight: '8px' }}
                            />
                            Sign up with Google
                        </button>
                    </form>
                    <p id = "yesAccount">Already have an account?</p>
                    <br />
                    <input id="signinButton3" type="submit" value="Sign In" onClick={handleLoginAsk}/>
                </div>
            </div>
        </div>
    );
}

export default Register;
