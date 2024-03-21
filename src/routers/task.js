const express = require("express")
const Task = require('../models/task')
const auth=require('../middleware/auth')
//create new route set up those routes and register it with express application
const router=new express.Router()

router.get('/test',(req,res)=>{
    res.send("This is from my other router")
})

//---------------------------------------------------------------------------
//tasks---------------------------------------------------------------------
router.post('/tasks', auth,async (req, res) => {
    // const task = new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user.id //this is got via middleware auth
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (er) {
        res.status(400).send(er)
    }
})
//implementing pagination
// GET tasks?limit=10&skip=10

//implementing sorting
// GET tasks?sortBy=createdAt:asc
// GET tasks?sortBy=createdAt:desc
router.get('/tasks', auth,async (req, res) => {
    //to process the query string for filter
    const match={}
    //set match iff query string has completed and a value for it
    //else gives all tasks
    if(req.query.completed){
        // setting the value of match.completed to true if the query parameter completed in the HTTP request is exactly equal to the string "true", otherwise, it would likely set it to false.
        match.completed=req.query.completed==="true"
    }
    //to process query string for sort
    const sort={}
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        // sort[either createdAt/completed] i.e. name of property for sorting
        //set it to either 1 or -1 acc to the one in URL
        sort[parts[0]]=parts[1]==='desc'?-1:1 //use ternary operator
    }

    try {
        //one way is to get all associated tasks by user id sent via auth middleware
        // const tasks = await Task.find({owner:req.user._id})
        // res.send(tasks)

        //or
        //use virtual feild and populate method
        await req.user.populate([{
            path:'myTasks',
            //either true/fasle/empty
            match,
            // for pagination and sorting 
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                // sort:{
                //     createdAt:-1
                //     completed:-1  //all true first 
                    
                // }
                //either createdAt:asc /createdAt:desc/empty
                sort

            } 
        }])
        res.send(req.user.myTasks)
    } catch (er) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth,async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)
        // fetch a task of given id and with the owner of the id as given by auth middleware
        const task=await Task.findOne({_id,owner:req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (er) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    validupdates=["description","completed"]
    const updates=Object.keys(req.body)
    const isValidOperation=updates.every((update)=>validupdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }

    try{
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new :true,runValidators:true})

        //mongodb way
        //const task=await Task.findById(req.params.id)
        //only find task if the owner id is same as authenticated id provided by auth middleware
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }

         //now iterate through updates array to implement each update
        // For each property specified in the updates array, it assigns the corresponding value from the request body to the user object. In other words, it updates the user object with the new values provided in the request.
        // For example, if the updates array contains ['name', 'age'], and the request body is { "name": "John", "age": 30 }, this loop would effectively set user.name to "John" and user.age to 30.
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e)
    {
        res.status(400).res.send(e)
    }
})

router.delete("/tasks/:id",auth,async(req,res)=>{
    try{
        // const task=await Task.findByIdAndDelete(req.params.id)
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(er){
        res.status(500).send()
    }
})

module.exports=router