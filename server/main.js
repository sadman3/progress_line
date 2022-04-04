const file = require('./service')

const express = require('express')

const app = express()

app.use(express.json())


app.listen(3000)
app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});  

app.get('/progress-line/:title', (req, res) => {
  console.log('Getting recipe ', req.params.title)
  var data = file.readProgressLine(req.params.title);
  res.send(data);
})


app.post('/progress-line/:title', (req, res) => {
  console.log('Updating recipe ', req.params.title)
  file.writeProgressLine(req.params.title, req.body);
  res.send("Successfully updated the progress line.");
})


app.get('/task-tree/:title', (req, res) => {
  console.log('Getting task tree ', req.params.title)
  var data = file.readTaskTree(req.params.title);
  res.send(data);
})


app.post('/task-tree/:title', (req, res) => {
  console.log('Updating recipe ', req.params.title)
  file.writeTaskTree(req.params.title, req.body);
  res.send("Successfully updated the task tree.");
})

