const express = require("express")
const multer=require('multer')
const sharp=require('sharp')
const User = require('../models/user')
//use auth as middleware function in routes
const auth=require('../middleware/auth')
//create new route set up those routes and register it with express application
const router=new express.Router()

router.get('/test',(req,res)=>{
    res.send("This is from my other router")
})


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
router.post('/users', async function(req, res) {
    const user = new User(req.body)
    try {
        await user.save()
        //generate token when we create the user and save
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//to check the user cred
router.post('/users/login', async (req, res)=> {
    try {
        //call findByCrredentials on User schema coz we are searching the entire "User" collection not one "user"
        const user=await User.findByCredentials(req.body.email,req.body.password)
        //create user token
        //call generateAuthToken on one user coz we are generating token for one "user" specifically not the entire "User" collection
        const token=await user.generateAuthToken()
        // from auth.js
        // res.send({user,token})
        // res.send(user)

        //we dont want to send pw,other tokens etc in response body
        //so
        // res.send({user:user.getPublicProfile(),token})

        // instead of writing a function use toJSON to directly apply it 
        res.send({user:user,token})
        
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

//with middleware
// router.get('/users', auth ,async (req, res) => {

//async await without middleware functiom
router.get('/users', async (req, res) => {
    //actually this function is not needed it just leaks user info
    //but i kept it to get info quickly via api in insomnia
        try {
        //param is empty coz we need all users in collection
        const users = await User.find({})
        res.send(users)
    } catch (er) {
        res.status(500).send()
    }
})

//with middleware
//route to get particular users profile
//get iff authenticated
//here auth is the middleware function that we are using to authenticate
router.get('/users/me', auth,async (req, res) => {
    res.send(req.user)

})

//pass middleware function auth as a parameter
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            //req.token has the current token (returned by the auth function of middleware)
            //so check the token array of the user, if we find the current token remove it and return the rest
            //thus logging out from the current device only

            //token.token because each token in the tokens array is an obj with 2 prop (id,token)
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// //not needed so so commented
// router.get('/users/:id', async (req, res) => {
//     //get requested id
//     // console.log(req.params)
//     const _id = req.params.id

//     //takes id as param
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (er) {
//         res.status(500).send()
//     }
// })

//not by id
// router.patch('/users/:id',async(req,res)=>{
router.patch('/users/me',auth,async(req,res)=>{
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
    
    try{
        // it bypasses mongoose and does operations on db directly
        // so use traditional mongodb way to do this
        // const user=await User.findByIdAndUpdate(_id,userToBeUpdated,{ new:true,runValidators:true})

        
        //mongodb way
        //not needed coz not by id
        // const user=await User.findById( req.params.id)

        //now iterate through updates array to implement each update
        // For each property specified in the updates array, it assigns the corresponding value from the request body to the user object. In other words, it updates the user object with the new values provided in the request.
        // For example, if the updates array contains ['name', 'age'], and the request body is { "name": "John", "age": 30 }, this loop would effectively set user.name to "John" and user.age to 30.
        updates.forEach((update)=>{
            // user[update]=req.body[update]
            // coz u get it from auth 
            req.user[update]=req.body[update]
        })
        await req.user.save()

        // not needed as we logged in into that user we are not searching by id
        // if(!user){
        //     return res.status(404).send()
        // }

        // res.send(user)
        res.send(req.user)
    }catch(er){
        res.status(400).send(er)
    }
})
//delete by id, but no practical use
// router.delete("/users/:id",async(req,res)=>{
router.delete("/users/me",auth,async(req,res)=>{
    try{

        //here it was passed in the req url
        // const user=await User.findByIdAndDelete(req.params.id)
        //now
        //as user is being returned by auth middleware

        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        // res.send(req.user)

        // instead
        // just use mongoose remove method on the instance
        //BUT ITS NOT WORKING IDK WHY!!!!!!!!!!!!!
        //coz remove is deprecated
        // await req.user.remove()
        await req.user.deleteOne({_id:req.user._id})
        res.send(req.user)
    }catch(er){
        res.status(500).send()
    }
})

//define the middleware for multer with the name upload and a few options like dest,fileFilter,limits

const upload=multer({
    // dest:'avatars',
    // no need as we store it in db
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})
//route to upload images
//order of param is imp, first authenticate then upload
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    //req.file.buffer  i.e file uploaded by user
    //req.user.avatar= its returned from auth middleware after auth
    // req.user.avatar=req.file.buffer
    
    //resize and rename images using sharp
    //req.file.buffer  i.e file uploaded by user
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    //req.user.avatar= its returned from auth middleware after auth
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{  //its the arrow function to handle the upload middleware
    res.status(400).send({error:error.message})
})

//delete avatar
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

//route to display user avatar
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        //by defaault it is
        // res.send('Content-Type','application/json')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})
module.exports=router