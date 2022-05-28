const express = require('express')
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
require('dotenv').config()

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyrm9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const toolsColletions = client.db("toolsCollection").collection("Tools");
        const reviewColletions = client.db("toolsCollection").collection("reviews");
        const ordersColletions = client.db("toolsCollection").collection("orders");
        const profileColletions = client.db("toolsCollection").collection("profiles");
        app.get('/tools', async (req, res) => {
            const query = {}
            const cursor = toolsColletions.find(query);
            const result = await cursor.toArray()
            res.send(result)
        }
        )
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await toolsColletions.findOne(query)
            res.send(result)
        }
        )
        app.post('/review', async (req, res) => {
            const newData = req.body;
            const result = await reviewColletions.insertOne(newData)
            res.send(result)
        })
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewColletions.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.put('/profile', async (req, res) => {
            const email = req.query
            console.log(email)
            const data = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set: data
            };
            const result = await profileColletions.updateOne(email, updateDoc, options)
            res.send(result)
        })
        app.post('/profile', async (req, res) => {
            const newData = req.body;
            const result = await profileColletions.insertOne(newData)
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const newData = req.body;
            const result = await ordersColletions.insertOne(newData)
            res.send(result)
        })
        app.get('/orders', async (req, res) => {
            const email = req.query
            const cursor = ordersColletions.find(email);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersColletions.deleteOne(query);
            //console.log(result)
            res.send(result)
        })
    }

    finally {
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})