const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


//middleware 
app.use(cors());
app.use(express.json());


//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwqsj4c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    //create collection
    const usersCollection = client.db("rentalService").collection("users");
    const resultsCollection = client.db("rentalService").collection("results");
    const coursesCollection = client.db("rentalService").collection("courses");
    const enrolledCollection = client.db("rentalService").collection("enrolledStudent");

    //users get method
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //Update users data

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updateInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: req.body.name,
          mobile: req.body.mobile,
          address: req.body.address,
        },
      };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //results get method
    app.get("/results", async (req, res) => {
      const query = {};
      const cursor = resultsCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });
    //courses get method
    app.get("/courses", async (req, res) => {
      const query = {};
      const cursor = coursesCollection.find(query);
      const courses = await cursor.toArray();
      res.send(courses);
    });
    //all subject enrolled student get method
    app.get("/enrolledStudents", async (req, res) => {
      const query = {};
      const cursor = enrolledCollection.find(query);
      const enrolledStudent = await cursor.toArray();
      res.send(enrolledStudent);
    });
    //single subject enrolled student get method
    app.get("/enrolledStudents/:courseId", async (req, res) => {
      const courseId = req.params.courseId;
      const query = { courseId: courseId };
      const user = await enrolledCollection.findOne(query);
      res.send(user);
    });

    // get single user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // get single results
    app.get("/results/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await resultsCollection.findOne(query);
      res.send(result);
    });
    // get single course
    app.get("/courses/:courseId", async (req, res) => {
      const courseId = req.params.courseId;
      const query = { courseId: courseId };
      const result = await coursesCollection.findOne(query);
      res.send(result);
    });

    //post a user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  // client.close();
});









//test server
app.get('/', (req, res) => {
    res.send("Hello server ");
});

app.listen(port, () => {
    console.log("Server is running on port", port);
});



