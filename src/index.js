const express = require("express")
require('./db/mongoose')

const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app = express()
// const port = process.env.PORT || 3000
const port = process.env.PORT

//using multer example
// refer ../playground/multerpractice.js 
//------------------------------------------------------------------------------------
//use middleware
//next - it is the word specific to middleware 
// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     if(req.method==='GET'){
//         res.send("Get requested are diasabled")
//     }else{
//         next()
//     }
//     next()
    
// })

//middleware for handling if our site is under maintainance
// app.use((req,res,next)=>{
//     res.status(503).send("Site is currently down. Come back soon")
// })

//to get json req body as objects
app.use(express.json())
//use the User and Task router
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log("Server is up on port", port)
})

