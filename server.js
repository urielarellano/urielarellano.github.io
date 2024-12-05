const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
var mongoose = require('mongoose');

const app = express();
const port = 5500;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb+srv://urithebeaner:Ashorthike108@bookbase.bt2dd.mongodb.net/?retryWrites=true&w=majority&appName=BookBase';
mongoose.connect(uri);

/*
const client = new MongoClient(uri);

client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
    console.log('Connected to MongoDB');
    const db = client.db('BookBase');
});
*/

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// get = post data to the webpage, or do api response, whatever
    // retrieves data from url
// post = the user has inputted data, sent it to us (server)
    // data is in the body