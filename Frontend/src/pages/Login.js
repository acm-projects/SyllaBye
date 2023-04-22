import './Login.css';
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from './../syllabyelogo.png';
import { gapi } from 'gapi-script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    var CLIENT_ID
    var API_KEY
    var DISCOVERY_DOCS
    var SCOPES

    const res = fetch("http://localhost:1337/api/google-auth-keys", {
        method: "GET",
    }).then((res) => res.json()
    ).then((res) => {
        CLIENT_ID = res.CLIENT_ID
        API_KEY = res.API_KEY
        DISCOVERY_DOCS = res.DISCOVERY_DOCS
        SCOPES = res.SCOPES
    });

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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

    async function googleAuth() {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOCS],
                scope: SCOPES,
            }).then(() => {
                gapi.auth2.getAuthInstance().signIn().then(async () => {
                    const google = await gapi.auth2.getAuthInstance().currentUser
                    const googleUser = await google.get().getBasicProfile();
                    const userName = googleUser.getName();
                    const userEmail = googleUser.getEmail();

                    console.log(userName);
                    console.log(userEmail);

                    const response = await fetch('http://localhost:1337/api/google-auth-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: userName,
                            email: userEmail,
                        }),
                    })

                    const data = await response.json();
                    console.log(data);

                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('token')) {
                          console.log(localStorage.getItem(key));
                        }
                    }

                    if(data.status === 'ok'){
                        console.log("Works")
                        localStorage.setItem('token', data.user)
                        navigate('/home')
                    }
                    else if(data.status === 'error'){
                        alert("You already have an account with this email. Please login instead.")
                    }
                })
            })
        })
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
                            type="password"  
                        />
                        <br />
                        <input className='Buttons' id="signinButton" type="submit" value="Sign In"/>
                        <p className="or"> or </p>
                        <div className="googleBtn">
                            <button className="googleBtn">
                        <GoogleOAuthProvider clientId="436198478288-efo40fbhrj324kk9uktqfr20tthrt5dk.apps.googleusercontent.com">
                        <GoogleLogin
                            id = "googleButton"
                            onSuccess={googleAuth}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        > test </GoogleLogin> 
                        </GoogleOAuthProvider>
                        </button>
                        </div>
                        <p id = "noAccount">Don't have an account?</p>
                        <input className='Buttons' id="signupButton2" type="submit" value="Click here to sign up!" onClick={handleRegisterAsk}/>
                        
                        
                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;