const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')

const Messaage = mongoose.model("Message", {
    name: String,
    message: String
})

// const messages = [
//     { name: "Tom", message: "Yoo" },
//     { name: "Jane", message: "poo" },
//     { name: "Sera", message: "Daa" },
// ]

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const url = 'mongodb+srv://user:user@cluster0.nyny50j.mongodb.net/?retryWrites=true&w=majority'
//get messages response
app.get('/messages', (req, res) => {
    Messaage.find({}, (err, messages) => {
        res.send(messages)
    })

})
//post request
app.post('/messages', (req, res) => {
    var mesage = new Messaage(req.body);
    mesage.save(err => {
        if (err)
            sendStatus(500)
        io.emit('message', req.body)
        res.sendStatus(200)

    })
})
io.on('connection', (socket) => {
    console.log("a user connected")
})
mongoose.connect(url, err => {
    console.log("DB connected", err)
})
var server = http.listen(3000, () => {
    console.log("server listening on port", server.address().port)
})