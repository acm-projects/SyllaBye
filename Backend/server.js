const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const File = require('./models/file')
const jose = require('jose')
const bcrypt = require('bcryptjs')

require('dotenv').config()

app.use(cors())
app.use(express.json())

mongoose.set('strictQuery', true);
mongoose.connect(process.env.mongoURL)
// mongoose.connect("mongodb://127.0.0.1:27017", {useNewUrlParser: true});


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
            .setExpirationTime('2h')
            .sign(new TextEncoder().encode('secret123'))

        return res.json({status: 'ok', user: token})
    }
    else{
        return res.json({status: 'error', user: false})
    }
})

app.listen(1337, () => {
    console.log('Server started on 1337')
})