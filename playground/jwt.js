const jwt=require("jsonwebtoken")

const myfunction=async()=>{
    //1st parameter payload i.e. for which we are generating the token
    //pattern
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    // 3rd arg to expire token after sometime
    const token=jwt.sign({_id:'usersid'},'thismynewcourse',{expiresIn:'6 days'})
    console.log(token)

    const data=jwt.verify(token,'thismynewcourse')
    console.log(data)
    // throws error coz secret is not matching so not verified
    // const dat1a=jwt.verify(token,'thismyniuoewcourse')
    // console.log(dat1a)
}

myfunction()