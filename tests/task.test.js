const request=require('supertest')
const Task=require('../src/models/task')
const app=require('../src/app')
const {userOneId,userOne,setupDatabase}=require('./fixtures/db')


//this beforeEach runs before every test in this test suite
//contents shifted to db.js setupDatabase function
//to setup login and auth of user we are using setupDatabase
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