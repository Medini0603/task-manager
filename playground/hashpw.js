const bcrypt=require('bcryptjs')

const myfunction=async()=>{
    const pw='Red12345!'
    const hashedpw=await bcrypt.hash(pw,8)

    console.log(pw)
    console.log(hashedpw)

    const isMatch=await bcrypt.compare('red12345!',hashedpw)
    console.log(isMatch)
}

myfunction()