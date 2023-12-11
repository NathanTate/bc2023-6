const express = require('express');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 8000;

const swaggerOptions = require('./swaggerOptions');
const specifications = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specifications))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const deviceRouter = require('./routes/device');
app.use('/devices', deviceRouter)

app.listen(port, () =>{
    console.log('Server is running on port:' + port);
});

app.get("/UploadForm", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'UploadForm.html'));
});

app.get("/:id", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'details.html'));
});



