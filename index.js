const express = require('express')
const app = express()
const port = 3800

app.get('/', (req, res) => {
    res.send("Educational Server Side Running")
})

app.listen(port, () => {
    console.log("Educational server port", port)
})
