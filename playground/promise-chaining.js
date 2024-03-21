require('../src/db/mongoose')
const User=require('../src/models/user')

//65eae9578e98e0988289663d

User.findByIdAndUpdate("65eadaefab0a21f0307f9d3f",{age: 12}).then((user)=>{
    console.log(user)
    return User.countDocuments({age:12})
}).then((res)=>{
    console.log(res)
}).catch((e)=>{
    console.log(e)
})

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