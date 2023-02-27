const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/Syllabye')