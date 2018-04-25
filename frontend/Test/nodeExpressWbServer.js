var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/sandBox', function (req, res) {
  res.sendFile('index.html')
})
app.get('/Test', function (req, res) {
  res.sendFile('index2.html')
})
app.get('/', function (req, res) {
  res.sendFile('index.html')
})
