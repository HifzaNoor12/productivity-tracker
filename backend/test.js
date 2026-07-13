const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:admin098765fTJdsr@cluster0.kbqbwmm.mongodb.net/?appName=Cluster0";

async function test() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("CONNECTED");
        await client.close();
    } catch (err) {
        console.log(err);
    }
}

test();