const request=require('supertest')
const app=require('../src/app')
const User=require('../src/models/user')
const {userOneId,userOne,setupDatabase}=require('./fixtures/db')


//this beforeEach runs before every test in this test suite
//contents shifted to db.js setupDatabase function
beforeEach(setupDatabase)
//this afterEach runs after every test in this test suite
// afterEach(()=>{
//     console.log("After each")
// })

test('Should signup a new user',async()=>{
    //store the response in the variable called response
    const response=await request(app).post('/users').send({
        name:"Radhika",
        email:"rad@gmail.com",
        password:"MyPAss23"
    }).expect(201)

    //few testing ideas
    //Assert that the database was changed correctly
    // use the response body to find if the user exist in db 
    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertions about the response
    // expect(response.body.user.name).toBe('Radhika')
    expect(response.body).toMatchObject({
        user:{
            name:'Radhika',
            email:'rad@gmail.com'
        },
        token:user.tokens[0].token
    })
    //assert that pw is encrypted
    expect(user.password).not.toBe('MyPAss23')
})

test('Should login existing user',async()=>{
    const response=await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    //assert that a new token is added while the user logs in
    const user=await User.findById(userOneId)
    //2nd element coz 1st element  we are storing explicitly via beforeEach
    expect(response.body.token).toBe(user.tokens[1].token)
})
test('Should not login nonexisting user',async()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:"buvdft"
    }).expect(400)
})
test("Should get profile for user",async()=>{
    // await request(app).get('/users/me').send().expect(200)
    await request(app)
    .get('/users/me')
    // 1st elem in tokens array on that the token property has the required jwt token 
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
test("Should not get profile for not authenticated user",async()=>{
    // await request(app).get('/users/me').send().expect(200)
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})
test("Should delete user profile for auth user",async()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    //assert that user not found in db after delete
    const user=await User.findById(userOneId)
    expect(user).toBeNull()
})
test("Should not delete user profile for unauth user",async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image',async()=>{
    await request(app)
    .post('/users/me/avatar')   
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/girl.jpeg')
    .expect(200)

    const user=await User.findById(userOneId)
    // expect({}).toBe({})
    // 1===1
    // {}==={} //not possible

    expect({}).toEqual({})
    //expect the buffer to be there in db as avatar
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields',async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'Jessica'
    })
    .expect(200)

    //assert if its actually change in db
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jessica')
})
test('Should not update invalid user fields',async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location:'Mysore'
    })
    .expect(400)
})