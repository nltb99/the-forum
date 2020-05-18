const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userQandASchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

userQandASchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

module.exports = mongoose.model('UserQandASchema', userQandASchema)
