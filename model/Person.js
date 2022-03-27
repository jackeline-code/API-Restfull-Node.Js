const mongoose = require('mongoose')

const Person = mongoose.model('person', {
    name: String,
    salary: Number,
    approved: Boolean,
})

module.exports = Person