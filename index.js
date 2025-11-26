const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");
// require("dotenv").config();
app.use(cors()); // <-- allow all origins
app.use(express.json());

const uri = `mongodb+srv://eventManagmentDB:xIdzsptJ8saQFCsZ@cluster0.iesbwy6.mongodb.net/?appName=Cluster0`;
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
    const bookEventsCollection = db.collection("my-bookedEvent");
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
    });
    app.post("/add-event", async (req, res) => {
      const data = req.body;
      // console.log(data);
      //code deploy korar jonno test
      const result = await eventsCollection.insertOne(data);
      res.send(result);
    });
    app.post("/my-bookedEvent", async (req, res) => {
      const data = req.body;
      // console.log(data);
      //code deploy korar jonno test
      const result = await bookEventsCollection.insertOne(data);
      res.send(result);
    });
    app.get("/my-bookedEvent", async (req, res) => {
      const result = await bookEventsCollection.find().toArray();
      res.send(result);
    });
    // DELETE /courses/:id
    app.delete("/my-bookedEvent/:id", async (req, res) => {
      const eventId = req.params.id;
      console.log("🔍 Trying to delete:", eventId);

      try {
        // প্রথমে ObjectId দিয়ে try করুন
        let result = await bookEventsCollection.deleteOne({
          _id: new ObjectId(eventId),
        });
        
        console.log("📊 Result with ObjectId:", result);

        // যদি না পায়, তাহলে string দিয়ে try করুন
        if (result.deletedCount === 0) {
          result = await bookEventsCollection.deleteOne({
            _id: eventId, // without ObjectId conversion
          });
          console.log("📊 Result with string:", result);
        }

        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Event deleted successfully" });
        } else {
          // সব documents দেখুন
          const allDocs = await bookEventsCollection.find().toArray();
          console.log("📄 All documents in collection:", allDocs);
          res.status(404).json({ message: "Event not found" });
        }
      } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
          message: "Internal server error",
          error: error.message,
        });
      }
    });
    // 🟣 Update Course (only if email matches)
    app.put("/my-bookedEvent/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: data,
      };
      const result = bookEventsCollection.updateOne(query, update);

      res.send(result);
    });

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
