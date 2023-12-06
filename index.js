require('dotenv').config();
const {connectDb,createUser,findbyname,findUserbyId,findUsers,createExercise,searchExercices} = require('./mongoqueries.js');
connectDb();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');


app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

 


app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/views/index.html");
})
app.post('/asd/',(req,res)=>{

})
app.get('/api/users/',async (req,res)=>{
    const userArr = await findUsers(done)
    res.json(userArr)

})

app.post('/api/users/',async (req,res)=>{
    console.log(req.body.username);
    if(!req.body.username||req.body.username==="") {
        res.json({error:"no name provided"})
    }
    const userFinded = await findbyname(req.body.username,done)
    console.log(userFinded)
    if(userFinded){
        console.log("finded")
        res.json({
            username: userFinded.username,
             _id:userFinded._id
            })
    }else{
        console.log("created")
        const userCreated = await createUser(req.body.username,done)
        res.json({
            username: userCreated.username,
            _id:userCreated._id
            })
    }
})

app.post('/api/users/:_id/exercises', async(req,res)=>{
    //console.log(req.body.username);
    const regex = /^[0-9]+$/
    if(!req.body.description||req.body.description===""||!regex.test(req.body.duration)){
        res.json({error:"no description or duration added"})    
        return
    }
    console.log(req.body._id)
    const username = await findUserbyId(req.params._id,done)
    if(!username){
        res.json({error:"no username asociated with the id"})
        return
    }    

    let date = new Date(req.body.date)
    if(date.toString() === 'Invalid Date'){
        date = new Date()
    }        
    const timedate = date.getTime() 

    const reqjson = {
        _id: req.params._id,
        description: req.body.description,
        duration:parseInt(req.body.duration),
        date:timedate
    }
    const data = await createExercise(reqjson,done)
    const resJson = {
        username:username.username,
        description:data.description,
        duration:data.duration,
        date: data.date.toDateString(),
        _id:username._id,
    }
    res.json(resJson)
})
//leondaat
//656e52fc4e9744fcef8ff036
//https://exercise-tracker.freecodecamp.rocks/api/users/656dfb98c2e63b0014b067b0/logs?from=2023-5-1&to=2023-11-29&limit=1
//{ from: '2023-5-1', to: '2023-11-29', limit: '1' }
app.get('/api/users/:_id/logs?',async(req,res)=>{
    //console.log(req.query)
    const _id =req.params._id
    const username = await findUserbyId(_id,done)
    if(!username){
        res.json({error:"no username asociated with the id"})
        return
    }  
    const {from,to,limit} = req.query
    const exercises = await searchExercices({from,to,limit,_id},done)

    const resJson = {
        username:username.username,
        count:exercises.length,
        _id: username._id,
        log:exercises.map((e)=>{
            return {
                description:e.description,
                duration:e.duration, 
                date:e.date.toDateString()}
        })
    }
    //console.log(exercises, exercises.length)
    res.json(resJson)
})




function done(err=null,data=null){
    console.log(err||data)
}
const listen = app.listen(process.env.PORT||3000,()=>{
    console.log("app is listening on port " +listen.address().port )
})