const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    username:{
        type:String,
        require:true
    },    
}
,{collection:'Users'})

const exerciseSchema = new mongoose.Schema(
    {
        UserId:{
            type:String,
            require:true
        },    
        description:{
            type:String,
            require:true
        },
        duration:{
            type:Number,
            require:true
        },
        date:{
            type:Date,
            require:true
        },
    }
    ,{collection:'exercises'})
let User = mongoose.model('User',userSchema) 
let Exercise = mongoose.model('Exercise',exerciseSchema)

function connectDb(){
    mongoose.connect(process.env.MONGO_URI);
}

async function searchExercices({from,to,limit,_id},done){
    let fromdate = new Date(from)
    if(fromdate.toString() === 'Invalid Date'){
        console.log("Not valid From argument " + new Date(0).getTime())
        fromdate = new Date(0)
    }
    let todate = new Date(to)
    let asignto = true
    if(todate.toString() === 'Invalid Date'){        
        asignto = false        
        console.log("Not valid to argument")
    } 
    if(typeof limit === "string"){
        if(!isNaN(limit))console.log("isNumber")
        const exercises = await Exercise.find({
            UserId: _id,
            date: asignto?{$gte:fromdate,$lte:todate}:{$gte:fromdate}    
        }).limit(parseInt(limit))
        return exercises            
    }
    const exercises = await Exercise.find({
        UserId: _id,
        date: asignto?{$gte:fromdate,$lte:todate}:{$gte:fromdate}    
    })
    return exercises
}

async function createExercise({_id,description,duration,date},done){
    console.log({_id,description,duration,date})
    let newExercise = new Exercise({
        UserId:_id,
        description:description,
        duration: duration,
        date: date
    })
    try {
        const data = await newExercise.save()
        const findedData = await Exercise.findById(data._id)
        done(null,data)
        return findedData
    } catch (error) {
        done(error)
    }
}
async function createUser(username,done){
    let newUser = new User({
        username:username
    })
    try{
        const data = await newUser.save()
        const findedData = await User.findById(data.id)
        done(null,findedData)
        return findedData
    } catch(err){
        done(err)
    }   
}
async function findbyname(username,done){
    try {
        const data = await User.findOne({username:username})
        done(null,data)
        return data
    } catch (error) {
        done(error)
    }
}
async function findUserbyId(userId,done){
    try {
        const data = await User.findById(userId)
        done(null,data)
        return data
    } catch (error) {
        done(error)
    }
}



module.exports = {connectDb, createUser,findbyname,findUserbyId,createExercise,searchExercices}


