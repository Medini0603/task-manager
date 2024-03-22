const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../../src/models/user')
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

const setupDatabase=async()=>{
    console.log("Before each")
    //ALWAYS DELETES ALL USERS BEFORE STARTING
    await User.deleteMany()
    //CREATE ONE USER ALWAYS BEFORE ALL TESTS JUST TO TEST LOGIN AUTH etccc
    await new User(userOne).save()
}

module.exports={
    userOneId,
    userOne,
    setupDatabase
}