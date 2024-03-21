require('../src/db/mongoose')
const Task=require('../src/models/task')

//65eae9578e98e0988289663d



deleteTaskAndCount=async(id)=>{
    const task=await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:false})

    return count
}

deleteTaskAndCount("65ead46525827b9ba1f4ab51").then((c)=>{
    console.log(c)
}).catch((e)=>{
    console.log(e)
})