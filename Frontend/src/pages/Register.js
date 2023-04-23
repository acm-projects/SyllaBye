import './Register.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from './../syllabyelogo.png';
import { gapi } from 'gapi-script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';


function Register() {
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
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOCS],
                scope: SCOPES,
            }).then(() => {
                gapi.auth2.getAuthInstance().signIn().then(async () => {
                    const google = await gapi.auth2.getAuthInstance().currentUser
                    const googleToken = await google.get().getAuthResponse().id_token;
                    const googleUser = await google.get().getBasicProfile();
                    const userName = googleUser.getName();
                    const userEmail = googleUser.getEmail();

                    console.log(googleToken);
                    console.log(userName);
                    console.log(userEmail);

                    const response = await fetch('http://localhost:1337/api/google-auth-register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: userName,
                            email: userEmail,
                            password: googleToken,
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


            // const google = await gapi.auth2.getAuthInstance().currentUser
            // const googleToken = await google.get().getAuthResponse().id_token;
            // const googleUser = await google.get().getBasicProfile();
            // const userName = googleUser.getName();
            // const userEmail = googleUser.getEmail();





            // console.log(await gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile());
            // const googleUser = await gapi.auth2.getAuthInstance().currentUser.get();
            // // console.log(googleUser);

            
            // // console.log(googleToken);
            // const userName = await googleUser.getBasicProfile().getName();
            // console.log(userName);
            // const googleToken = googleUser.getAuthResponse().id_token;
            // const userEmail = googleUser.getBasicProfile().getEmail();
            // console.log(googleUser);
            // console.log(googleToken);
            // console.log(userName);
            // console.log(userEmail);


            // const googleToken = await gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
            // const googleUser = await gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
            // const userName = await gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
            // const userEmail = await gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();

            // const response = await fetch('http://localhost:1337/api/google-auth-register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         token: googleToken,
            //         name: userName,
            //         email: userEmail,
            //     })
            // })
            
    //         const response = await fetch('http://localhost:1337/api/google-auth-register', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 token: gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token,
    //                 name: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName(),
    //                 email: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail(),
    //             })
    //         })

    //         const data = await response.json()

    //         if(data.status === 'ok'){
    //             console.log("Works")
    //             localStorage.setItem('token', data.user)
    //             navigate('/home')
    //         }
    //         else if(data.status === 'error'){
    //             alert("You already have an account with this email. Please login instead.")
    //         }
    //     })
    // }

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
                        <input id="signupButton" className="Buttons" type="submit" value="Sign Up"/>
                        <p className="or"> or </p>
                    </form>
                    <button className="googleBtn">
                    <GoogleOAuthProvider clientId="436198478288-efo40fbhrj324kk9uktqfr20tthrt5dk.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={googleAuth}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </GoogleOAuthProvider>
                    </button>
                    <p id = "yesAccount">Already have an account?</p>
                    <input className='Buttons' id="signinButton3" type="submit" value="Click here to sign in!" onClick={handleLoginAsk}/>
                    <br />
                </div>
            </div>
        </div>
    );
}

export default Register;
