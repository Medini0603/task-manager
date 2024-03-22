const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../../src/models/user')
const Task=require('../../src/models/task')
//create our own id for the mongoose instance
const userOneId=new mongoose.Types.ObjectId()
//one user thats always created before all tests in test db
const userOne={
    _id:userOneId,
    name:"Medini",
    email:"medini@gmail.com",
    password:"fnvtr54i",
    //setup token for the user using tokens array
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}
const userTwoId=new mongoose.Types.ObjectId()
const userTwo={
    _id:userTwoId,
    name:"Sannidhi",
    email:"sannidhi@gmail.com",
    password:"bg54gb54iu",
    //setup token for the user using tokens array
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const taskOne={
    _id:new mongoose.Types.ObjectId(),
    description:"First task",
    completed:false,
    owner:userOne._id
}
const taskTwo={
    _id:new mongoose.Types.ObjectId(),
    description:"Second task",
    completed:true,
    owner:userOne._id
}
const taskThree={
    _id:new mongoose.Types.ObjectId(),
    description:"third task",
    completed:true,
    owner:userTwo._id
}

const setupDatabase=async()=>{
    console.log("Before each")
    //ALWAYS DELETES ALL USERS BEFORE STARTING
    await User.deleteMany()
    await Task.deleteMany()
    //CREATE ONE USER ALWAYS BEFORE ALL TESTS JUST TO TEST LOGIN AUTH etccc
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports={
    userOneId,
    userOne,
    setupDatabase,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree
}