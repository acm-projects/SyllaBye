import './Login.css';
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function loginUser(event) {
        console.log('login');
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
            alert('Login successful')
            navigate('/dashboard')
        }
        else{
            alert('Please check your email and password')
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
                    <form onSubmit = {loginUser}>
                        <label for="signinField" id="signin">Sign In</label>
                        <label for="personNameField" class = "labels2" id = "personName">Username</label>
                        <input 
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                            type="text"  
                        />
                        <br />
                        <label for="passwordField" class = "labels2" id = "password">Password </label>
                        <br />
                        <input 
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            type="text"  
                        />
                        <br />
                        <input type="submit" value="Sign In"/>
                        <br />
                        <p id = "noAccount">Don't have an account?</p>
                        <br />
                        <input type="submit" value="Sign Up"/>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
