const pet={
    name:'Choco'
}

pet.toJSON=function()
{
    console.log(this)
    return {}
}
console.log(JSON.stringify(pet))