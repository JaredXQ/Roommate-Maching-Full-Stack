// Load required packages
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
// Define our user schema


const PersonalInfoSchema = new mongoose.Schema({
    gender: {
        type: String,
        default: ""
    },
    major: {
        type: String,
        default: ""
    },
    year: {
        type: String,
        default: ""
    },
    degree: {
        type: String,
        default: ""
    },
    college: {
        type: String,
        default: ""
    },
    smoke: {
        type: String,
        default: ""
    },
    sleeping_schedule: {
        type: String,
        default: ""
    },
    cook: {
        type: String,
        default: ""
    },
    introverted: {
        type: String,
        default: ""
    },
    pets: {
        type: String,
        default: ""
    },
    clean: {
        type: String,
        default: ""
    },
    loud_sounds: {
        type: String,
        default: ""
    },
})

const MatchingInfoSchema = new mongoose.Schema({
    gender: {
        type: String,
        default: ""
    },
    major: {
        type: String,
        default: ""
    },
    smoke: {
        type: String,
        default: ""
    },
    sleeping_schedule: {
        type: String,
        default: ""
    },
    cook: {
        type: String,
        default: ""
    },
    introverted: {
        type: String,
        default: ""
    },
    pets: {
        type: String,
        default: ""
    },
    clean: {
        type: String,
        default: ""
    },
    loud_sounds: {
        type: String,
        default: ""
    },
})

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
    ,
    personal_info:{
        type: PersonalInfoSchema,
        default: {
            major: "",
            gender: "",
            smoke: "",
            sleeping_schedule: "",
            cook: "",
            introverted: "",
            pets: "",
            clean: "",
            loud_sounds: "",
            year: "",
            degree: "",
            college: ""
        }
    },
    matching_info:{
        type: MatchingInfoSchema,
        default: {
            major: "",
            gender: "",
            smoke: "",
            sleeping_schedule: "",
            cook: "",
            introverted: "",
            pets: "",
            clean: "",
            loud_sounds: "",
        }
    },
    favourite_list: {
        type: [String],
        default: []
    },
    info_completed:{
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: new Date()
    }
}, {minimize: false});

// hide sensitive info
/***** [optional]
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
*/

// email password loginin system
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// hash plain text password before saving 
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'arandomverifier')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

const User = mongoose.model('User', userSchema)
module.exports = User