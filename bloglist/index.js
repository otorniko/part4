const express = require("express")
require("dotenv").config()
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log("connecting to", url)
mongoose
    .connect(url)
    .then(() => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB:", error.message)
    })
const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
})

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const Blog = mongoose.model("Blog", blogSchema)

app.use(cors())
app.use(express.json())

app.get("/api/blogs", (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

app.post("/api/blogs", (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then(result => {
        response.status(201).json(result)
    })
})

app.delete("/api/blogs/:id", (request, response) => {
    Blog.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: "malformatted id" })
        })
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
