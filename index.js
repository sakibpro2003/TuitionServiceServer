const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = "mongodb+srv://solosphere:solosphere@cluster0.cphe2d0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const serviceCollection = client.db("TuitionService").collection("Services");

async function run() {
    try {
        // await client.connect(); // Connect to the MongoDB server
        
        // Test connection to MongoDB
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get("/services", async (req, res) => {
            try {
                const result = await serviceCollection.find().toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send("Error fetching services.");
            }
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Ensure that the client will close when you finish/error
        // Uncomment the following line in a production environment
        // await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log("Server running on port:", port);
});

app.get("/", (req, res) => {
    res.send("Hello from the other side");
});
