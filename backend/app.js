const express = require('express')
const app = express();
const colors = require('colors')
require('dotenv').config()
const router = require('./routes/UserRoutes')
const blogRouter = require('./routes/BlogRoutes')

const connectDB = require('./config/db')

connectDB()
app.use(express.json())
app.use('/api/user/', router)
app.use('/api/blog', blogRouter)


app.use('/', (req, res, next) => {
    res.send("Hello Backend!")
})

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
})