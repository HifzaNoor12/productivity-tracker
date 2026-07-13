// Import required packages

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
console.log("Updated server.js is running");
global.crypto = require("crypto");
// Load environment variables

dotenv.config();


// Create Express application

const app = express();



// Middleware

app.use(cors());

app.use(express.json());

const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));


//mongoose.connect(process.env.MONGO_URI)
//.then(() => {
  //  console.log("Connected");
//})
//.catch(err => {
  //  console.log("ERROR NAME:", err.name);
    //console.log("ERROR MESSAGE:", err.message);
    //console.log("FULL ERROR:");
    //console.dir(err, { depth: null });
//});
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch(err => {
    console.log("❌ MongoDB Connection Error:");
    console.log("   Name:", err.name);
    console.log("   Message:", err.message);
    if (err.cause) {
        console.log("   Cause:", err.cause);
    }
});

// Add event listeners for better debugging
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected to the database');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
//mongoose.connect(process.env.MONGO_URI)
//.then(() => {
    //console.log("MongoDB Connected Successfully");
//})
//.catch(err => {
    //console.log("NAME:", err.name);
    //console.log("MESSAGE:", err.message);

    //if (err.cause) {
       // console.dir(err.cause, { depth: null });
   // }
//});
//.catch((err) => {
  //  console.log("NAME:", err.name);
    //console.log("MESSAGE:", err.message);
    //console.log("CAUSE:", err.cause);
    //process.exit(1);
//});
// MongoDB Connection
//console.log(process.env.MONGO_URI);

//mongoose.connect(process.env.MONGO_URI)

//.then(() => {

    //console.log("MongoDB Connected Successfully");

//})

//.catch((error)=>{

    //console.log("MongoDB Connection Failed");

    //console.log(error);

//});


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    }

});


const User = mongoose.model("User", userSchema);


// Task Schema


const taskSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },


    description:{
        type:String
    },


    deadline:{
        type:String,
        required:true
    },


    status:{
        type:String,
        default:"Pending"
    },


    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }


});



const Task = mongoose.model("Task", taskSchema);

// ===============================
// GOAL SCHEMA
// ===============================


const goalSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },


    description:{
        type:String
    },


    deadline:{
        type:String,
        required:true
    },


    progress:{
        type:Number,
        default:0
    },


    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }


});



const Goal = mongoose.model("Goal", goalSchema);


app.post("/api/register", async(req,res)=>{


try{


const {
name,
email,
password
}=req.body;



// check existing user

const existingUser =
await User.findOne({email});



if(existingUser)
{

return res.status(400).json({
message:"User already exists"
});

}



// encrypt password

const hashedPassword =
await bcrypt.hash(password,10);




// create user

const user = new User({

name:name,

email:email,

password:hashedPassword

});



await user.save();



res.status(201).json({

message:"User Registered Successfully"

});



}


catch(error)
{

console.log(error);

res.status(500).json({
    message:error.message
});




}



});
app.post("/api/login",async(req,res)=>{


try{


const {
email,
password
}=req.body;



const user =
await User.findOne({email});



if(!user)
{

return res.status(404).json({

message:"User not found"

});

}



const isPasswordCorrect =
await bcrypt.compare(
password,
user.password
);



if(!isPasswordCorrect)
{

return res.status(401).json({

message:"Invalid Password"

});

}




const token =
jwt.sign(

{
id:user._id
},

process.env.JWT_SECRET,

{
expiresIn:"1h"
}

);



res.json({

message:"Login Successful",

token:token,

user:{
_id:user._id,
name:user.name,
email:user.email
}

});



}


catch(error)
{


res.status(500).json({

message:error.message

});


}



});

// CREATE TASK API


app.post("/api/tasks", async(req,res)=>{


try{


const task = new Task({

title:req.body.title,

description:req.body.description,

deadline:req.body.deadline,

userId:req.body.userId


});



await task.save();



res.status(201).json({

message:"Task Created Successfully",

task:task

});


}


catch(error)
{

res.status(500).json({

message:error.message

});


}


});

// GET TASKS API


app.get("/api/tasks/:userId", async(req,res)=>{


try{


const tasks = await Task.find({

userId:req.params.userId

});



res.json(tasks);


}


catch(error)
{


res.status(500).json({

message:error.message

});


}


});

// UPDATE TASK STATUS


app.put("/api/tasks/:id", async(req,res)=>{


try{


const task =
await Task.findByIdAndUpdate(

req.params.id,

{
status:req.body.status
},

{
new:true
}

);



res.json({

message:"Task Updated Successfully",

task:task

});


}


catch(error)
{

res.status(500).json({

message:error.message

});

}


});

// DELETE TASK API


app.delete("/api/tasks/:id", async(req,res)=>{


try{


await Task.findByIdAndDelete(
req.params.id
);



res.json({

message:"Task Deleted Successfully"

});


}


catch(error)
{

res.status(500).json({

message:error.message

});

}


});

// ===============================
// CREATE GOAL API
// ===============================


app.post("/api/goals", async(req,res)=>{


try{


const goal = new Goal({

title:req.body.title,

description:req.body.description,

deadline:req.body.deadline,

progress:0,

userId:req.body.userId


});



await goal.save();



res.status(201).json({

message:"Goal Created Successfully",

goal:goal

});


}


catch(error)
{


res.status(500).json({

message:error.message

});


}


});

// ===============================
// GET GOALS API
// ===============================


app.get("/api/goals/:userId", async(req,res)=>{


try{


const goals =
await Goal.find({

userId:req.params.userId

});



res.json(goals);



}


catch(error)
{


res.status(500).json({

message:error.message

});


}


});


app.put("/api/goals/:id", async(req,res)=>{


try{


const goal =
await Goal.findByIdAndUpdate(

req.params.id,

{
progress:req.body.progress
},

{
returnDocument:"after"
}

);



res.json({

message:"Progress Updated Successfully",

goal:goal

});


}


catch(error)
{

res.status(500).json({

message:error.message

});

}


});

// ===============================
// GET SINGLE GOAL API
// ===============================

app.get("/api/goal/:id", async(req,res)=>{

try{

const goal = await Goal.findById(req.params.id);

if(!goal)
{
return res.status(404).json({
message:"Goal Not Found"
});
}

res.json(goal);

}

catch(error){

res.status(500).json({
message:error.message
});

}

});

// ===============================
// DELETE GOAL API
// ===============================


app.delete("/api/goals/:id", async(req,res)=>{


try{


await Goal.findByIdAndDelete(
req.params.id
);



res.json({

message:"Goal Deleted Successfully"

});


}


catch(error)
{

res.status(500).json({

message:error.message

});


}


});

// Test Route

//app.get("/", (req,res)=>{

    //res.send("Backend Server is Running");

//});

//app.post("/api/tasks", async(req,res)=>{


//try{


//const task = new Task({

//title:req.body.title,

//description:req.body.description,

//deadline:req.body.deadline,

//userId:req.body.userId

//});


//await task.save();


//res.status(201).json({

//message:"Task Created Successfully",

//task:task

//});


//}


//catch(error)
//{

//res.status(500).json({

//message:error.message

//});

//}


//});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
// Server Port

const PORT = process.env.PORT || 5000;



app.listen(PORT,()=>{

    console.log(`Server running at: http://localhost:${PORT}`);

});