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
console.log(uri)

async function run(){
    try{
        await client.connect()
        const database = client.db("educationalWeb")
        const teachersCollection = database.collection("teachers")

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
