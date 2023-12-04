require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//mongoose.connect(process.env.MONGO_URI);



app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/views/index.html");
})
app.post('/asd/',(req,res)=>{

})

app.post('/api/users/',(req,res)=>{
    console.log(req.body.username);
})

app.post('/api/users/:_id/exercises',(req,res)=>{
    console.log(req.body.username);

    const reqjson = {
        _id: req.params._id,
        description: req.body.description,
        duration:req.body.duration,
        date:req.body.date
    }
    res.json(reqjson)
})
//https://exercise-tracker.freecodecamp.rocks/api/users/656dfb98c2e63b0014b067b0/logs?from=2023-5-1&to=2023-11-29&limit=1
//{ from: '2023-5-1', to: '2023-11-29', limit: '1' }
app.get('/api/users/:_id/logs?',(req,res)=>{
    console.log(req.query)
})


const listen = app.listen(process.env.PORT||3000,()=>{
    console.log("app is listening on port " +listen.address().port )
})