const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken")
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000
require("dotenv").config()

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k04k15i.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {

    const homesCollection = client.db("AirCnC").collection("homes")
    const usersCollection = client.db("AirCnC").collection("users")
    const bookingsCollection = client.db("AirCnC").collection("bookings")


    app.post("/homes", async(req, res)=>{
      const home = req.body;
      const result = await homesCollection.insertOne(home)
      res.send(result)
    })


    app.put("/user/:email", async (req, res) => {
      const email = req.params.email
      const user = req.body;
      const filter = { email: email }
      const option = { upsert: true }
      const updateDoc = {
        $set: user,
      }
      const result = await usersCollection.updateOne(filter, updateDoc, option)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
      res.send({ result, token })
    })

    app.get("/user/:email", async(req,res)=>{
      const email = req.params.email; 
      const query = {email: email }
      const filter = await usersCollection.findOne(query)
      res.send(filter)
    })

    app.get("/all-users", async(req, res)=>{
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result)
    })

    // get specific booking using user email
    app.get("/bookings", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        guestEmail: email
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result)
    })

    app.post("/bookings", async (req, res) => {
      const filter = req.body;
      const result = await bookingsCollection.insertOne(filter);
      res.send(result)
    })

    app.get("/all-bookings", async (req, res)=>{
      const query = {}
      const result = await bookingsCollection.find(query).toArray();
      res.send(result)
    })



  } finally {

  }
}

run().catch(error => console.log(error))




app.get("/", (req, res) => {
  res.send("App successfully running")
})

app.listen(port, () => {
  console.log(`App running on the port ${port}`)
})