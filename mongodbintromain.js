// CRUD operations

const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const connectionURL='mongodb://127.0.0.1:27017'
const dbName='task-manager'

const ObjectID=mongodb.ObjectId
const id=new ObjectID()
console.log(id)
console.log(id.getTimestamp())
console.log(id.id)
console.log(id.id.length)
console.log(id.toHexString().length)

const client=new MongoClient(connectionURL)
console.log("Connection successful")
const db=client.db(dbName)
// console.log(db)

db.collection('users').insertOne({
    name:'Medini',
    age:22
})
//refresh the localmongodb collection to see dbname of 'task-manager' and in that collection



//now insertOne function with a callback function
//but not working!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//coz new driver dont have callback option on insertone
db.collection('users').insertOne({
    name:'Radhika',
    age:22
},(error,result)=>{
    if(error){
        return console.log("Unable to insert user")
    }
    console.log(result.insertedId)

})

const res= db.collection('users').insertMany([
    {
        name:"abc",
        age:28
    },
    {
        name:'idk',
        age:10
    }

])
// console.log(res.insertedIds)

db.collection('users').insertMany([
    {
        name:"abc",
        age:28
    },
    {
        name:'idk',
        age:10
    }

])



// --------------------------------------------------------------
//---------------------------------deprecated---------------------------------------
// MongoClient.connect(connectionURL,{useNewUrlParser: true},(error,client)=>{
//     if(error){
//         return console.log("Unable to connect to database")
//     }
//     console.log("Connected correctly")
// })