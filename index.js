const { MongoClient } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 3800

app.use(express.json())
app.use(cors())
app.use(fileUpload())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e3dsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run(){
    try{
        await client.connect()
        const database = client.db("educationalWeb")
        const usersCollection = database.collection("users")
        const teachersCollection = database.collection("teachers")
        const classesCollection = database.collection("classes")
        const studentsCollection = database.collection("students")
        const noticeCollection = database.collection("notice")
        const libraryCollection = database.collection("library")
        const reviewsCollection = database.collection("reviews")
        
        // insert user data in database
        app.post('/users', async(req, res) => {
            const userData = req.body
            console.log(userData)
            const result = await usersCollection.insertOne(userData)
            res.json(result)
            // console.log("user data result", result)
        })

        // update user data 
        app.put('/users', async(req, res) => {
            const userData = req.body
            // console.log(userData)
            const filter = {email: userData.email}
            const options = {upsert: true}
            const updateDoc = {$set: userData}
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
            // console.log("user update result", result)
        })

        // find email and set head teacher role
        app.put('/users/head', async(req, res) => {
            const head = req.body
            // console.log("head Teachers email", head.email)
            const filter = {email: head.email}
            const updateDoc = {$set: {role: "head"}}

            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        // check head teacher using email 
        app.get('/users/:email', async(req, res) => {
            const email = req.params.email 
            // console.log("show email", email)
            const query = {email: email}
            const result = await usersCollection.findOne(query)
            // console.log("users result", result)
            let isHead = false
            if(result?.role === "head"){
                isHead = true 
            }
            res.json({head: isHead})
        })

        // GET method to collect teachers data 
        app.get('/teachers', async(req, res) => {
            const cursor = teachersCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        // Get method to show one teacher data in UI
        app.get('/teachers/:id', async(req, res) => {
            const id = req.params.id
            // console.log("teacher id", id)
            const query = {_id: ObjectId(id)}
            const result = await teachersCollection.findOne(query)
            res.json(result)
            // console.log("teacher id result", result)
        })

        // Post calsses data to database
        app.post('/classes', async(req, res) => {
            const classData = req.body 
            const result = await classesCollection.insertOne(classData)
            res.json(result)
            // console.log("student classes data result", result)
        })

        app.get('/classes/:email', async (req, res) => {
            const userEmail = req.params.email 
            // console.log("user email", userEmail)
            const query = {email: userEmail}
            const cursor = classesCollection.find(query)
            const result = await cursor.toArray()
            // console.log("find user order result", result)
            res.json(result)
            // console.log("user classes result", result)
        })

        // Delete student calss from database 
        app.delete('/classes/:id', async(req, res) => {
            const dltId = req.params.id 
            // console.log("class id", dltId)
            const query = {_id: ObjectId(dltId)}
            const result = await classesCollection.deleteOne(query)
            console.log("deleted class result", result)
            res.json(result)

        })

        // Post admission students data to database
        app.post('/students', async(req, res) => {
            const studentsData = req.body
            // console.log("students data ", studentsData)
            const result = await studentsCollection.insertOne(studentsData)
            res.json(result)
            // console.log("students result", result)
        })

        app.get('/students', async(req, res) => {
            const cursor = studentsCollection.find({})
            const result = await cursor.toArray()
            // console.log("student data result", result)
            res.json(result)
        })

        // Delete an student form database 
        app.delete('/students/:id', async(req, res) => {
            const dltId = req.params.id 
            // console.log("students id", dltId)
            const query = {_id: ObjectId(dltId)}
            const result = await studentsCollection.deleteOne(query)
            console.log("delete student result", result)
            res.json(result)

        })

        // Post notice data in database
        app.post('/notices', async(req, res) => {
            // const noticeData = req.body
            const title = req.body.title 
            const description = req.body.description
            const pic = req.files.image 
            const picData = pic.data
            const encodedPic = picData.toString('base64')
            const imageBuffer = Buffer.from(encodedPic, 'base64')
            const noticeData = {
                title,
                description,
                image: imageBuffer
            }
            console.log(noticeData)
            const result = await noticeCollection.insertOne(noticeData)
            res.json(result)
            // console.log("notice data", noticeData)
            // console.log("files", req.files )
        })

        // Get notice data from database
        app.get('/notices', async(req, res) => {
            const cursor = noticeCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // Get library data from database 
        app.get('/library', async(req, res) => {
            const cursor = libraryCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // post review data on database
        app.post('/reviews', async(req, res) => {
            // const reviewsData = req.body
            // console.log("reviews data",reviewsData)
            // console.log("reviews images", req.files)
            const name = req.body.name 
            const description = req.body.description
            const pic = req.files.image 
            const picData = pic.data
            const encodedPic = picData.toString('base64')
            const imageBuffer = Buffer.from(encodedPic, 'base64')
            const reviewData = {
                name,
                description,
                image: imageBuffer
            }
            // console.log(reviewData)
            const result = await reviewsCollection.insertOne(reviewData)
            res.json(result)
        })

        // get reviews data from database 
        app.get('/reviews', async(req, res) => {
            const cursor = reviewsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
            
        })

    }finally{
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Educational Server Side Running")
})

app.listen(port, () => {
    console.log("Educational server port", port)
})
