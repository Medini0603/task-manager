const express = require("express")


const app = express()
const port = process.env.PORT || 3005

//using multer example
const multer=require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1 //1 megabytes
//     }
// })

//define the middleware for multer with the name upload and a few options like dest,fileFilter,limits
const upload = multer({
    dest:'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        // if(!file.originalname.endsWith('.pdf')){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word doc'))
        }
        cb(undefined,true)
        // cb(new Error("file must be a pdf"))
        // cb(undefined,true)
        // cb(undefined,false)

    }
})


app.post("/upload",upload.single('upload'),(req,res)=>{
    res.send()
},(error,req,res,next)=>{  //its the arrow function to handle the upload middleware
    res.status(400).send({error:error.message})
})


app.use(express.json())

app.listen(port, () => {
    console.log("Server is up on port", port)
})

