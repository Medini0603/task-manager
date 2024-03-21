const mongoose=require('mongoose')
const validator=require("validator")
//append db name at end of URL
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true
})

//this has been moved to models 
//there we are using seperate models for users and tasks
// we can define schema separately and pass name of that variable into 2nd argument 
//2 arguments 1- string name for model, 2- schema of model--------------------------------------------
//  use same variable name and the string name i.e User=mongoose.model('User')
//  use same variable name and the string name i.e Task=mongoose.model('Task')
const User=mongoose.model('User',{
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password cannot contain 'password'")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age must be a positive number")
            }
        }

        }
    }
)

// instantiate the object of that model ------------------------------------------------------------
// const nu=new User({
//     name:"Medini",
//     // age:"ilkdyujyfht"
//     age:21
// })

const nu=new User({
    name:"   Perth   ",
    email:'PERTH@gmail.com',
    password:'   wkrh45rtg     '
})

// // save it to db----------------------------------------------------------------------------
nu.save().then(()=>{
console.log(nu)
}).catch((err)=>{
console.log(err)
})

//// similarly task collection----------------------------------------------
const Task=mongoose.model("Task",{
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

const task=new Task({
    description:"Eat lunch      ",
    // completed:false
})

task.save().then(()=>{
    console.log(task)
}).catch((err)=>{
    console.log(err)
})