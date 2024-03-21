const mongoose=require('mongoose')
const validator=require("validator")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
//to define a schema
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        //i.e. every email should be unique
        unique:true,
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
        },
    //to store tokens
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
    

    },{
        //adds createAt and updatedAt fields for the instance, by default it is set to false
        timestamps:true
    })
//to create a rleationship between user and task use virtual method

userSchema.virtual('myTasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

// create a function on one user repeatedly
// it is called on only one specific user 

// not using arrow function coz we use this keyword
userSchema.methods.generateAuthToken=async function(){
    const user=this
    // console.log(user._id.toString())
    const id=user._id.toString()
    // const token=jwt.sign({ _id:id },'thisismycourse')
    const token=jwt.sign({ _id:id },process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

// not using arrow function coz we use this keyword
// userSchema.methods.getPublicProfile=function(){
    //instead of using a distinct name  
userSchema.methods.toJSON=function(){
    const user=this
    //toObject is a mongoose function
    const userObject=user.toObject()
    //to delete object properties
    delete userObject.password
    delete userObject.tokens
    //too large so slows down the response so no need
    delete userObject.avatar
    return userObject
}


// create a function on User model that can be used repeatedly
// it is called on the entire User collection
userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error("Unable to login")
    }
    
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user
}

//hashing password and storing
//use middleware to manipulate the pw
//using "pre" hook on save
userSchema.pre('save',async function(next){
    //here this refers to the user entry that we are trying to save
    const user=this

    // console.log('Just before saving')
    // console.log(user)
    if(user.isModified("password")){
        console.log('Encrypting pw')
        user.password=await bcrypt.hash(user.password,8)
    }
    console.log('encryption done')

    //to say that middleware has finished the func and user can be saved
    next()
})

//use middleware and ore hook to cascade delete
userSchema.pre('deleteOne',{document:true},async function(next){
    const user=this
    console.log(user)
    await Task.deleteMany({owner:user._id})
    next()
})


//use the above schema as the 2nd arg to create mongoose model
const User=mongoose.model('User',userSchema)

module.exports=User