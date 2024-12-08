const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 5500;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb+srv://urithebeaner:Ashorthike108@bookbase.bt2dd.mongodb.net/?retryWrites=true&w=majority&appName=BookBase';
const client = new MongoClient(uri);

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function main() {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('BookBase');
    const usersCollection = db.collection('Users');

    /*
    await usersCollection.insertOne({
        email: 'stever@gmail.com',
        password: 'ninja'
    });
    */

    app.post('/login', async (req, res) => {
        const {email, password} = req.body;
        try {
            await usersCollection.insertOne({email, password});
            res.status(200).send('User signed up successfully');
        } catch (error) {
            console.error('Error inserting user', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

main().catch(console.error);




// get = post data to the webpage, or do api response, whatever
    // retrieves data from url
// post = the user has inputted data, sent it to us (server)
    // data is in the body