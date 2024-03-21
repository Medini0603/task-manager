require('../src/db/mongoose')
const User=require('../src/models/user')


const updateAgeCount=async(id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age:age})
    // const count=await User.countDocuments({age:age})
    const count=await User.countDocuments({age})
    return count
}

updateAgeCount("65eaca6099db26d319512758",2).then((c)=>{
    console.log(c)
}).catch((e)=>{
    console.log(e)
})