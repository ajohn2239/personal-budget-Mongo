const express = require('express');
const mongoose = require('mongoose');
const Budget = require('./models/budget');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017/budget';
const client = new MongoClient(uri);

app.use(express.static('public'));

client.connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

// GET endpoint to fetch data 
app.get('/budget', async (req, res) => {
    try {
        const db = client.db("budget"); 
        const budgetCollection = db.collection("budget"); 
        const budgetData = await budgetCollection.find().toArray();
        console.log(budgetData); 
        res.json(budgetData); 
    } catch (error) {
        console.error('Error fetching budget data', error);
        res.status(500).json({ message: error.message });
    }
});

// POST endpoint to add new data
app.post('/budget', async (req, res) => {
    const { title, budget, color } = req.body;

    try {
        // Insert new entry directly into collection
        const db = client.db("budget");
        const budgetCollection = db.collection("budget");

        const newBudgetEntry = {
            title: title,
            budget: budget,
            color: color
        };

        const result = await budgetCollection.insertOne(newBudgetEntry)

        if (result && result.insertedId) {
            const insertedDocument = await budgetCollection.findOne({ _id: result.insertedId });
            res.status(201).json(insertedDocument);
        } else {
            res.status(400).json({ message: "Failed to insert budget data." });
        }
        } 
         catch (error) {
        console.error('Error saving budget data', error);
        res.status(400).json({ message: error.message });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
