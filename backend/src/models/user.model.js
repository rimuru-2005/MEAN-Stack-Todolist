const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default:'user'
    },
    password: {
        type: String,
        // here select prevents the field form being inculded in Query
        select: false
    }
})

module.exports = mongoose.model('User', userSchema);
