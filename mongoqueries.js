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
            type:String,
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

async function createUser(username,done){
    let newUser = new User({
        username:username
    })
    try{
        const data = await newUser.save()
        const findedData = await User.findOne({_id:data.id})
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

module.exports = {connectDb, createUser,findbyname}


