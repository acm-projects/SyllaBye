const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const File = require('./models/file')
const jose = require('jose')
const bcrypt = require('bcryptjs')
const multer = require('multer');
const upload1 = multer();
const storage = multer.memoryStorage();
const upload2 = multer({ storage });

require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use("/", express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MongoURL)

app.get('/api/google-auth-keys', async (req, res) => {
    const keys = {
        CLIENT_ID : process.env.ClientID,
        API_KEY : process.env.APIKey,
        DISCOVERY_DOCS : process.env.DiscoveryDocs,
        SCOPES : process.env.Scopes
    }

    res.json(keys)
})

app.post('/api/register', async (req, res) => {
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({status: 'ok'})
    }
    catch(err){
        res.json({status: 'error', error: err})
    }
})

app.post('/api/google-auth-register', async (req, res) => {
    try{
        //Add here
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        // res.json({status: 'ok'})
        const token = await new jose.SignJWT({
            name: req.body.name,
            email: req.body.email,
        })
            .setProtectedHeader({alg: 'HS256'})
            .setIssuedAt()
            .sign(new TextEncoder().encode(process.env.JWTKey))

        return res.json({status: 'ok', user: token})
    }
    catch(err){
        res.json({status: 'error', error: err})
    }
})

app.post('/api/login', async (req, res) => {
    
    const user = await User.findOne({
        email: req.body.email,
    })

    if(!user){
        return res.json({status: 'error', error: 'invalid login'})
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if(isPasswordValid){
        const token = await new jose.SignJWT({
            name: user.name,
            email: user.email,
        })
            .setProtectedHeader({alg: 'HS256'})
            .setIssuedAt()
            .sign(new TextEncoder().encode(process.env.JWTKey))

        return res.json({status: 'ok', user: token})
    }
    else{
        return res.json({status: 'error', user: false})
    }
})

app.post('/api/google-auth-login', async (req, res) => {

    try{
        const user = await User.findOne({
            email: req.body.email,
        })

        const token = await new jose.SignJWT({
            name: user.name,
            email: user.email,
        })
            .setProtectedHeader({alg: 'HS256'})
            .setIssuedAt()
            .sign(new TextEncoder().encode(process.env.JWTKey))

        return res.json({status: 'ok', user: token})
    }
    catch(err){
        res.json({status: 'error', error: err})
    }
})

app.post('/api/upload', upload1.fields([upload2.single({ name: 'text' }), { name: 'thumbnail' }]), async (req, res) => {
    try{
        if (!req.body) {
            res.status(400)
            res.end()
            console.log("test")
        }
    }
    catch(err){
        console.log("THERE IS AN ERROR\n\n\n")
        console.log(err)
    }

    const token = req.headers['x-access-token'];
    try{
        const {payload, protectedHeader} = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWTKey))
        const userEmail = payload.email
        const thumbnail = req.body.thumbnail
        const text = JSON.parse(req.body.text);

        await File.create({
            email: userEmail,
            thumbnail: thumbnail,
            fileData: text,
        })

        res.send("Success")
    }
    catch(err){
        console.log(err)
    }
})

app.get('/api/files', async (req, res) => {
    try{
        const token = req.headers['x-access-token'];

        const {payload, protectedHeader} = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWTKey))
        const userEmail = payload.email

        const files = await File.find({
            email: userEmail,
        })
        
        if(files.size == 0){
            res.json([])
        }
        else{
            const data = []
            files.forEach((file) => {
                data.push(file)
            })

            res.json(data)
        }
        
    }
    catch(err){
        console.log(err)
        res.status(500)
    }
})

app.listen(1337, () => {
    console.log('Server started on 1337')
})