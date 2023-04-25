const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLenght: 3,
            maxLength: 16,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true,
        },
        avatarUrl: String,
        password: {
            type: String,
            minLength: 3,
            maxLength: 80,
            select: false,
            required: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            default: 'local',
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports.User = mongoose.model('User', userSchema)
