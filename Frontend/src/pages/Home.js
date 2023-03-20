import React, {useEffect, useState, useCallback} from "react";
import {useNavigate} from 'react-router-dom'
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import ImageGrid from "./components/ImageGrid";
import cuid from "cuid";
import * as jose from 'jose'

function Home() {
    const navigate = useNavigate()

    const [images, setImages] = useState([]);

    async function logout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            const user = jose.decodeJwt(token)
            if(!user){
                localStorage.removeItem('token')
                navigate('/login')
            }
            else{
                //
            }
        }
        else{
            navigate('/login')
        }
    }, [])

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                setImages((prevState) => [
                    ...prevState,
                    { id: cuid(), src: e.target.result },
                ]);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    return (
        <main className="App">
        <button onClick={logout}>Logout</button>

        <Header/>
        
        <Dropzone 
            onDrop={onDrop} 
            accept={"application.pdf"} 
            restrictions={{
            allowedExtensions: [".pdf"]
            }}
        />

        <ImageGrid images={images}/>

        </main>
    );
}

export default Home;