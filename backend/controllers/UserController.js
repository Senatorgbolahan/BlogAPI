const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');
const { bgYellow } = require('colors');


const getAllUser = asyncHandler(async(req, res, next) => {
    let users;

    //**********************************  Find if user already exists
    users = await User.find({})

    if (!users) {
        return res.status(404).json({ message: "No users found!" })
    }

    return res.status(200).json({ users: users })
})

// @desc Signup a user
// @route /api/user/signup
// @access Public
const signUp = asyncHandler(async(req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser, user;

    //**********************************  validation
    if (!name || !email || !password) {
        return res.status(404).json({ message: "Please enter your name,email and password" })
    }

    //**********************************  Find if email already exists
    existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "Email already exist, Use another email" })
    }

    //**********************************  Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    try {
        user = new User({ name: name, email: email, password: hashPassword, blogs: [] })
        await user.save()

    } catch (error) {
        return console.log(error);
    }
    return res.status(201).json({ user: user })

})


const login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    //**********************************  Find if email already exists
    existingUser = await User.findOne({ email })
    if (!existingUser) {
        return res.status(400).json({ message: "Could not find User by this Email" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" })
    }
    return res.status(200).json({ message: "Login Succesful" })


})


module.exports = {
    getAllUser,
    signUp,
    login
}