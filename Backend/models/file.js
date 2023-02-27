const mongoose = require('mongoose')

const File = new mongoose.Schema(
    {
        email: {type: String, required: true},
        pdf: {type: Object, required: true},
    }
)