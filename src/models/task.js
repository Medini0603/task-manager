const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    //set the owner id who created that object
    owner: {
        //type is the objectID of mongodb
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //this gives us the ref to the User model
        ref: 'User'
    }
},{
    //adds createAt and updatedAt fields for the instance, by default it is set to false
    timestamps:true
}
)
const Task = mongoose.model("Task", taskSchema)
module.exports = Task