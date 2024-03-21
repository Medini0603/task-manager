require('../src/db/mongoose')
const Task=require('../src/models/task')

//65eae9578e98e0988289663d

Task.findByIdAndDelete("65eaeb8edead804f428cc80f").then((task)=>{
    console.log(task)
    return Task.countDocuments({completed:false})
}).then((res)=>{
    console.log(res)
}).catch((e)=>{
    console.log(e)
})