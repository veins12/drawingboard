const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();  // Load environment variables from .env file
const port = 3000;
const app = express();

// Middleware
app.use(bodyParser.json());  // Parse JSON data

// Connect to MongoDB using the connection string from .env
mongoose.connect('mongodb://localhost:27017/drawingart')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a schema and model for storing drawings
const drawingSchema = new mongoose.Schema({
    imageData: String, // Store the image as a base64 string
    createdAt: { type: Date, default: Date.now }
});

const Drawing = mongoose.model('Drawing', drawingSchema);

app.use(express.static(__dirname));


app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
})

// Handle Save request
app.post('/save-drawing', async (req, res) => {
    const { imageData } = req.body;

    try {
        const newDrawing = new Drawing({ imageData });
        await newDrawing.save();

        res.status(200).send('Drawing saved successfully!');
    } catch (error) {
        res.status(500).send('Error saving drawing.');
    }
});

// Start the server using the PORT from .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
