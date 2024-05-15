import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'please provide job title'],
        minLength: [3, 'Job title must contain atleast 3 characters'],
        maxLength: [15, 'Job title must contain maximum 15 characters'],
    },
    description: {
        type: String,
        required: [true, 'please give job description'],
        minLength: [50, 'Job title must contain atleast 50 characters'],
        maxLength: [350, 'Job title must contain maximum 350 characters'],
    },
    category: {
        type: String,
        required: [true, 'job category required']
    },
    city: {
        type: String,
        required: [true, 'job city category required']
    },
    country: {
        type: String,
        required: [true, 'job country category required']
    },
    location: {
        type: String,
        required: [true, 'job location category required'],
        minLength: [50, 'Job location must contain atleast 50 characters'],
        maxLength: [350, 'Job location must contain maximum 350 characters'],
    },
    fixedSalary: {
        type: Number,
        minLength: [4, 'fixed salary must contain atleast 4 digits'],
        maxLength: [10, 'fixed salary must contain atleast 10 digits'],
    },
    salaryFrom: {
        type: Number,
        minLength: [4, ' salary must contain atleast 4 digits'],
        maxLength: [10, ' salary must contain atleast 10 digits'],
    },
    salaryTo: {
        type: Number,
        minLength: [4, ' salary must contain atleast 4 digits'],
        maxLength: [10, ' salary must contain atleast 10 digits'],
    },
    expired: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }
})

export const Job = mongoose.model('Job', jobSchema)
