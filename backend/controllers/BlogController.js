const Blog = require('../models/Blog')
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');


//********************************************  Get all blogs
const getAllBlogs = asyncHandler(async(req, res, next) => {
    let blogs;
    blogs = await Blog.find({});

    if (!blogs) {
        return res.status(404)
        throw new Error("No blogs found")
    }

    return res.status(200).json({ blogs })

})


//********************************************  Add blog
const addBlog = asyncHandler(async(req, res, next) => {
    const { title, description, image, user } = req.body;

    let existingUser;
    //**********************************  validation
    if (!title || !description || !image || !user) {
        return res.status(404).json({ message: "Please enter your title,description,image and user" })
    }

    //**********************************  validate if user exist
    try {
        existingUser = await User.findById(user)
    } catch (error) {
        return console.log(error);
    }

    if (!existingUser) {
        return res.status(400).json({ message: "unable to find User by this ID" })
    }

    //**********************************  save blog to database
    let blog = new Blog({ title, description, image, user })

    try {
        // blog = new Blog({ title: title, description: description, image: image, user: user })
        // await blog.save()
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session })
        existingUser.blogs.push(blog)
        await existingUser.save({ session })
        await session.commitTransaction();
    } catch (error) {
        return res.status(500).json({ message: error });
    }
    return res.status(201).json({ blog: blog })


})


//********************************************  Update blog
const updateBlog = asyncHandler(async(req, res, next) => {
    const { title, description } = req.body;
    // const { id } = req.params.id;
    const blogId = req.params.id;
    let blog;

    try {
        blog = await Blog.findByIdAndUpdate(blogId, { title, description })
    } catch (error) {
        return error;
    }

    if (!blog) {
        return res.status(200).json({ message: "Unable to update the blog post" })
    }
    return res.status(200).json({ blog: blog })

})

//********************************************  Get blog by Id
const getById = asyncHandler(async(req, res, next) => {
    const id = req.params.id;
    let blog;

    if (!id) {
        return res.status(404)
        throw new Error(`No blog id: ${id} found`)
    }

    blog = await Blog.findById(id)

    if (!blog) {
        return res.status(404)
        throw new Error("No blog found")
    }
    return res.status(200).json({ blog: blog })
})


//********************************************  Delete blog
const deleteBlog = async(req, res, next) => {
    const id = req.params.id;
    let blog;

    try {
        blog = await Blog.findByIdAndRemove(id)
    } catch (error) {
        console.log(error);
    }
    if (!blog) {
        return res.status(500).json({ message: "Unable To Delete" })
    }
    return res.status(200).json({ message: "successfully Deleted" })
}



module.exports = {
    getAllBlogs,
    addBlog,
    updateBlog,
    getById,
    deleteBlog,
}