const request=require('supertest')
const Task=require('../src/models/task')
const app=require('../src/app')
const {userOneId,userOne,setupDatabase,userTwo,userTwoId,taskOne,taskTwo,taskThree}=require('./fixtures/db')


//this beforeEach runs before every test in this test suite
//contents shifted to db.js setupDatabase function
//to setup login and auth of user we are using setupDatabase
console.log("hiii")
beforeEach(setupDatabase)
test('Should create task for user',async()=>{
    const response=await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my tests'
    })
    .expect(201)

    //assert if task was saved in db
    const task=await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks',async()=>{
    const response=await request(app)
    .get('/tasks')
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    //assert if we auth user1 who has created 2 tasks and call get tasks we only get array of 2 tasks created by user1 not more or less
    // res.send(req.user.myTasks)
    // this end point returns an array so access length of array
    expect(response.body.length).toEqual(2)
})

test(' should not delete other users tasks',async()=>{
    const response=await request(app).
    delete(`/tasks/${taskOne._id}`)
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    //assert that task is not deleted from the db
    const task=await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})