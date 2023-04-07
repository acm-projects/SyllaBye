const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const File = require('./models/file')
const jose = require('jose')
const bcrypt = require('bcryptjs')
const fileUpload = require('express-fileupload');
const multer = require('multer');
const upload = multer();

require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use("/", express.static("public"));
app.use(fileUpload());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.mongoURL)

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
        res.json({status: 'error', error: 'Duplicate email'})
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

//app.post('/api/upload', async (req, res) => {
app.post('/api/upload', upload.fields([{ name: 'text' }]), async (req, res) => {
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
        const text = await req.body.text
        //const thumbnail = await req.body.thumbnail

        console.log(text)
        //console.log(thumbnail)
        //console.log(req.files.thumbnail)
        // await File.create({
        //     email: userEmail,
        //     thumbnail: req.body.thumbnail,
        //     fileData: req.body.extractedText
        // })
        res.send("Success")
    }
    catch(err){
        console.log(err)
    }
})

app.listen(1337, () => {
    console.log('Server started on 1337')
})