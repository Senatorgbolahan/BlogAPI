const express = require('express')
const { getAllBlogs, addBlog, updateBlog, getById, deleteBlog } = require('../controllers/BlogController')
const router = express.Router()


router.get("/", getAllBlogs)
router.post("/add", addBlog)
router.put("/update/:id", updateBlog)
router.get("/:id", getById)
router.delete('/:id', deleteBlog)


module.exports = router;