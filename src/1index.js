//---------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!--------------------------------------------------
//1 bulky index.js with all endpoints in one file
//the actual index.js is minimal where we just import the routes from the directory and just call them
const express = require("express")
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

//to get json req body as objects
app.use(express.json())


const router=new express.Router()
router.get('/test',(req,res)=>{
    res.send("This is from my other router")
})
app.use(router)

//routes like post,get,delete,patch
//-------------------------------------------
//users-------------------------------------------------------------

// //without aync await!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// app.post('/users',(req,res)=>{
//     const user=new User(req.body)
//     user.save().then(()=>{
//         res.status(201).send(user)
//     }).catch((e)=>{
//         res.status(400).send(e)
//         // res.send(e)
//     })
// })

//with async await!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//no async await
// app.get('/users',(req,res)=>{
//     //param is empty coz we need all users in collection
//     User.find({}).then((users)=>{
//         res.send(users)
//     }).catch((er)=>{
//         res.status(500).send()
//     })
// })

//async await
app.get('/users', async (req, res) => {
    //param is empty coz we need all users in collection
    try {
        const users = await User.find({})
        res.send(users)
    } catch (er) {
        res.status(500).send()
    }

})

app.get('/users/:id', async (req, res) => {
    //get requested id
    // console.log(req.params)
    const _id = req.params.id

    //takes id as param
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (er) {
        res.status(500).send()
    }
})

app.patch('/users/:id',async(req,res)=>{
    //convert reqbody to object keys
    const updates=Object.keys(req.body)
    //array of properties allowed to be updated
    const allowedUpdates=['name','email','password','age']

    //check if all update feild in the req is in the array or not
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    
    const _id=req.params.id
    const userToBeUpdated=req.body
    try{
        const user=await User.findByIdAndUpdate(_id,userToBeUpdated,{ new:true,runValidators:true})

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }catch(er){
        res.status(400).send(er)
    }
})

app.delete("/users/:id",async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }catch(er){
        res.status(500).send()
    }
})
//---------------------------------------------------------------------------
//tasks---------------------------------------------------------------------
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (er) {
        res.status(400).send(er)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (er) {
        res.status(500).send()
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (er) {
        res.status(500).send()
    }
})

app.patch('/tasks/:id',async(req,res)=>{
    validupdates=["description","completed"]
    const updates=Object.keys(req.body)
    const isValidOperation=updates.every((update)=>validupdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }

    try{
        const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new :true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e)
    {
        res.status(400).res.send(e)
    }
})

app.delete("/tasks/:id",async(req,res)=>{
    try{
        const task=await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(er){
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log("Server is up on port", port)
})