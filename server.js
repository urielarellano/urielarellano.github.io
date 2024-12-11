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

    // log a user in
    app.post('/login', async (req, res) => {
        const {email, password} = req.body;
        try {
            const user = await usersCollection.findOne({email, password});
            if (!user) {
                res.status(404).send('User not found');
                return;
            }
            res.status(200).send('User logged in successfully');
        } catch (error) {
            console.error('Error finding user', error);
            res.status(500).send('Internal Server Error');
        }
    });

    // sign up a new user
    app.post('/signup', async (req, res) => {
        const {email, password, location} = req.body;
        try {
            const user = await usersCollection.findOne({email, password, location});
            if (user) {
                res.status(409).send('User already exists');
                return;
            }
            else {
                await usersCollection.insertOne({email, password, location});
                res.status(200).send('User signed up successfully');
            }
        } catch (error) {
            console.error('Error inserting user', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/addBook', async (req, res) => {
        const {email, bookTitle, list} = req.body;

        try {
            const user = await usersCollection.findOne({email});
            if (!user) {
                res.status(404).send('User not found');
                return;
            }
            if (user[list] && user[list].includes(bookTitle)) {
                res.status(409).send('Book already exists in list');
                return;
            }
            const updatedUser = await usersCollection.updateOne({email}, {$push: {[list]: bookTitle}});
            res.status(200).send('Book added to list');
        } catch (error) {
            console.error('Error adding book to list', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/removeBook', async (req, res) => {
        const {email, bookTitle, list} = req.body;

        try {
            const user = await usersCollection.findOne({email});
            if (!user) {
                res.status(404).send('User not found');
                return;
            }
            if (!user[list] || !user[list].includes(bookTitle)) {
                res.status(409).send('Book does not exist in list');
                return;
            }
            const updatedUser = await usersCollection.updateOne({email}, {$pull: {[list]: bookTitle}});
            res.status(200).send('Book removed from list');
        } catch (error) {
            console.error('Error removing book from list', error);
            res.status(500).send('Internal Server Error');
        }
    });

    // check if the user is logged in based on email and password params and return their info
    app.get('/home', async (req, res) => {
        const {email, password} = req.query;
        try {
            const user = await usersCollection.findOne({email, password});
            if (user) {
                //res.status(200).send('User found: ' + email);
                res.status(200).send(user);
                console.log('Current user:', user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error('Error finding user', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/userEmails', async (req, res) => {
        const { bookTitle } = req.query;
        console.log(bookTitle);
        try {
            const lists = ['read', 'reading', 'wishlist'];
            const query = {
                $or: lists.map(list => ({[list]: bookTitle}))
            };

            const users = await usersCollection.find(query).toArray();
            if (users.length > 0) {
                console.log(users.map(user => user.email));
                res.status(200).send(users.map(user => user.email));
            } else {
                res.status(404).send('No users found with the specified book');
            }
        } catch (error) {
            console.error('Error finding users', error);
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