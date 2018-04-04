"use strict"

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mainRouter = require('./app')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

dotenv.config()

const port = process.env.PORT || 8080

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(mainRouter)

app.listen(port, () => console.log(`You're listening to station: ${port}`))