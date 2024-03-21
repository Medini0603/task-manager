
//use middleware
//next - it is the word specific to middleware 
app.use((req,res,next)=>{
    console.log(req.method,req.path)
    if(req.method==='GET'){
        res.send("Get requested are diasabled")
    }else{
        next()
    }
    next()
    
})


//middleware for handling if our site is under maintainance
app.use((req,res,next)=>{
    res.status(503).send("Site is currently down. Come back soon")
})