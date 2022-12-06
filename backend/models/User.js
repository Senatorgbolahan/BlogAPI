const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please type your email"],
        //unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: 6,
    },
    blogs: [{
        type: mongoose.Types.ObjectId,
        ref: "Blog",
        required: true,
    }]
})

module.exports = mongoose.model("User", UserSchema);