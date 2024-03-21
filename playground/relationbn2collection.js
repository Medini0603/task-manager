const Task=require('../src/models/task')
const User=require('../src/models/user')

require('../src/db/mongoose')

const main=async()=>{
    //grab the task id
    const task=await Task.findById('65fab471a03b013483e7db91')
    // finds user who is associated with this task in owner field (i.e by id )
    await task.populate([{path:'owner'}])
    console.log(task.owner)

    //find all tasks of a given user id

    const user=await User.findById("65fab34fb8ce1d5ca20740f3")
    //call the virtaully set feild
    await user.populate([{path:'myTasks'}])
    console.log(user.myTasks)
}

main()