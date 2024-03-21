const jwt=require("jsonwebtoken")
const User=require("../models/user")

const auth=async(req,res,next)=>{
    try{
        //look for header with that name
        const token=req.header('Authorization').replace('Bearer ','')
        console.log(token)
        //verify
        // const decoded=jwt.verify(token,"thisismycourse")
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded)
        //find the user with the decoded id and the latest token
        // i.e. find for the the token in tokens array 
        const user=await User.findOne({ _id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).send({error:"Please authenticate"})
    }
}

module.exports=auth