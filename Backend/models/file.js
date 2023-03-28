const mongoose = require('mongoose')

const File = new mongoose.Schema(
    {
        email: {type: String, required: true},
        courseNumber: {type: String, required: true},
        data: {type: Object, required: true},
    },
    {collection: 'file-data'}
)

const model = mongoose.model('FileData', File)

module.exports = model;