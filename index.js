const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");
// require("dotenv").config();
app.use(cors()); // <-- allow all origins
app.use(express.json());

const uri =
  `mongodb+srv://eventManagmentDB:xIdzsptJ8saQFCsZ@cluster0.iesbwy6.mongodb.net/?appName=Cluster0`;
// const uri =process.env.MONGO_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//mongodb connect in there
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("eventManagmentDB");
    const eventsCollection = db.collection("events");
    app.get("/events", async (req, res) => {
      const result = await eventsCollection.find().toArray();
      res.send(result);
    });
    app.post("/events", async (req, res) => {
      const data = req.body;
      // console.log(data);
      //code deploy korar jonno test
      const result = await eventsCollection.insertOne(data);
      res.send(result);
    });
      app.get("/events/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await eventsCollection.findOne(query);

      console.log(id);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
