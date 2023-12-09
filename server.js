const express = require('express');
const path = require('path');
const fs = require('fs')

const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const deviceRouter = require('./routes/device')
app.use('/devices', deviceRouter)

app.listen(port, () =>{
    console.log('Server is running on port:' + port);
});

app.get("/", (req, res) => {
    
});

