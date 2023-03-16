import './Register.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'


function Register() {
    const navigate = useNavigate()
    function handleLoginAsk(e){
        e.preventDefault();
        navigate('/login');
    }
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [vPassword, setVPassword] = useState('');

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
    return (
        <div className="App">
            <header className="App-header">
                <div className = "nameEnc">
                    <label for="nameField" id="name">Syllabye</label>
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
