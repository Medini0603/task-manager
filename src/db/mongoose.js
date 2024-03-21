const mongoose=require('mongoose')

//append db name at end of URL
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
// })
//use env var
mongoose.connect(process.env.MONGODB_URL,{
})