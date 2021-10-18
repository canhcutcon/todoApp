const moongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../modals/task');

const userSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val))
                throw new Error('Email is invalid!');
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// creat connect between tasks and user
userSchema.virtual('task', {
        ref: 'tasks',
        localField: '_id',
        foreignField: 'owner'
    })
    // create token
userSchema.methods.geneAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//hiding data
userSchema.methods.toJSON = function() {
    const user = this;
    const userOject = user.toObject();

    delete userOject.tokens;
    delete userOject.password;
    delete userOject.avatar;

    return userOject;
}

userSchema.statics.findByIdCredentials = async(email, password) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('No user!');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Wrong pass!!');
        }
        return user;
    }
    // hash the plan text password before save
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//delete user'tasks when remove user
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = moongoose.model('User', userSchema);
module.exports = User