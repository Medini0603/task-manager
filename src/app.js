//only for testing as supertest does not need listen
//but index.js needs and has app.litsen
const express = require("express")
require('./db/mongoose')

const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app = express()

//to get json req body as objects
app.use(express.json())
//use the User and Task router
app.use(userRouter)
app.use(taskRouter)


module.exports=app