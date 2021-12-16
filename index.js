const { MongoClient } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const port = process.env.PORT || 3800

app.use(express.json())
app.use(cors())

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
            console.log(userData)
            const filter = {email: userData.email}
            const options = {upsert: true}
            const updateDoc = {$set: userData}
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
            console.log("user update result", result)
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
            console.log("student classes data result", result)
        })

        // Post admission students data to database
        app.post('/students', async(req, res) => {
            const studentsData = req.body
            console.log("students data ", studentsData)
            const result = await studentsCollection.insertOne(studentsData)
            res.json(result)
            console.log("students result", result)
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
