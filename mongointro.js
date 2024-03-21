const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient


// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

const database = client.db("insertDB");
async function run() {
  try {
    await client.connect();

    
    const foods = database.collection("foods");

    // create an array of documents to insert
    const docs = [
      { name: "bun", healthy: false },
      { name: "cabbage", healthy: true },
      { name: "cake", healthy: false }
    ];

    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true };

    const result = await foods.insertMany(docs, options);
    console.log(result.insertedIds)
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
