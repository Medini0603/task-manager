const { calculateTip,fahrenheitToCelsius,celsiusToFahrenheit,add } = require('../src/mathfortest')

// test("name",function)
//if function throws error then test fails
//else test passes

// test('Hello world',()=>{

// })

// test('This should fail',()=>{
//     throw new Error('Failure')
// })

test('Calculate total with tip', () => {
    const total = calculateTip(10, .3)
    //assertions
    //     if (total !== 13) {
        //         throw new Error("Total tip should be 13, Got ", total)
        //     }
    expect(total).toBe(13)
})

test('Calculate total with defualt tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
  
})

test('should convert 32F to 0C',()=>{
    const temp=fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})
test('should convert 0C to 32F',()=>{
    const temp=celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

//done word to wait until timeout of async function
// test('Async test demo',(done)=>{
//     setTimeout(() => {
//         expect(1).toBe(2)
//     }, 2000);
// })

//promise
test("Should add 2 numbers",(done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})
//async await
test("Should add 2 numbers async/await",async()=>{
    const sum=await add(3,2)
    expect(sum).toBe(5)
})