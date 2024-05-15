import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true, 'please provide your name'],
        minLength: [3, 'name must contain atleast 3 character'],
        maxLength: [30, 'name cant exceed 30 characters']
    },
    email: {
        type: String,
        require: [true, 'please provide your email'],
        validate: [validator.isEmail, 'please provide your correct email']
    },
    phone: {
        type: Number,
        require: [true, 'please provide your contact number']
    },
    password: {
        type: String,
        required: [true, 'please provide your password'],
        minLength: [8, 'name must contain atleast 8 character'],
        select: false,
        maxLength: [32, 'name cant exceed 32 characters']
    },
    role: {
        type: String,
        require: [true, 'please provide your role'],
        enum: ['job seeker', 'employer']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

//hash the password
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

//compare the password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//generate a jwt for authorization
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this.id },
        process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

export const User = mongoose.model('User', userSchema)