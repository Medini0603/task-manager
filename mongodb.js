// CRUD operations

const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const connectionURL = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(connectionURL)

const dbName = 'taskmanager'

async function mainforinsert() {
    // connect to client 
    await client.connect();
    console.log("Connection successful")

    //define db and collections in that db
    const db = client.db(dbName)
    const ucollection = db.collection("users")
    const tcollection = db.collection("tasks")
    // -----------------------------------------------------------------------------
    //insert one
    const ures = await ucollection.insertOne({ name: "Medini", age: 21 })
    const tres = await tcollection.insertOne({ description: "Clean the room", completed: false })
    //store one id to use in findone by id
    const idExample = ures.insertedId
    console.log(idExample)
    console.log(ures)
    console.log(tres)

    //insert many
    const userres = await ucollection.insertMany([{ name: "Radhika", age: 40 },
    { name: "Sannidhi", age: 13 },
    { name: "abc", age: 21 }]
    )
    const taskres = await tcollection.insertMany([{ description: "Clean the kitchen", completed: false },
    { description: "Complete the course", completed: true }]
    )

    console.log(userres)
    console.log(taskres)

    //findone 
    const users = await ucollection.findOne({ name: "Medini" })
    console.log(users)

    //not there
    const u = await ucollection.findOne({ name: "Medini", age: 1 })
    console.log(u)

    //by id
    const uid = await ucollection.findOne({ _id: new mongodb.ObjectId(idExample) })
    console.log(uid)

    //find
    const tasks = await tcollection.find({ completed: false }).toArray()
    console.log(tasks)

    //count
    const t = await tcollection.find({ completed: false }).count()
    console.log(t)
    // -------------------------------------------------------------------------
}

// mainforinsert()

//repeat it coz we are not using async here instead use promises
//-------------------------------------------------------------------------------------------
client.connect();
console.log("Connection successful")
//define db and collections in that db
const db = client.db(dbName)
const ucollection = db.collection("users")
const tcollection = db.collection("tasks")
//---------------------------------------------------------------------------------------


//update
const promiseres = ucollection.updateOne({
    _id: new mongodb.ObjectId("65e9c6bf1b1a1c05c15aa6d7")
}, {
    $set: {
        name: "Vaishali"
    }
})

promiseres.then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})

//INSTEAD OF USING PROMISERESULT as seperate variable
// call `then` function on that only

ucollection.updateOne({
    _id: new mongodb.ObjectId("65e9c6bf1b1a1c05c15aa6d7")
}, {
    $inc: {
        age: 2
    }
}).then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})

tcollection.updateMany({
    completed:false
},{
    $set:{
        completed:true
    }
}
).then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})

//delete
ucollection.deleteMany({
    age:21
}).then((res)=>{
console.log(res)
}).catch((err)=>{
console.log(err)
})

tcollection.deleteOne({
    description:"Clean the room"
}).then((res)=>{
console.log(res)
}).catch((err)=>{
console.log(err)
})