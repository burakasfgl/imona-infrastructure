require("dotenv").config();

const express=require("express");

const {MongoClient}=require("mongodb");

const app=express();
const bcrypt=require("bcrypt");
app.use(express.json());
const jwt=require("jsonwebtoken");
function auth(req,res,next){

 const header=

 req.headers.authorization;

 if(!header){

  return res.status(401)

  .json({

   message:"no token"

  });

 }

 const token=

 header.split(" ")[1];

 try{

  const decoded=

  jwt.verify(

   token,

   "supersecret"

  );

  req.user=decoded;

  next();

 }

 catch{

  return res.status(401)

  .json({

   message:"invalid token"

  });

 }

}



const mongo=new MongoClient(
 process.env.MONGO_URI
);

let db;

async function start(){

 await mongo.connect();

 db=mongo.db("imona");

 console.log(
  "Mongo Connected"
 );




 app.listen(
  process.env.PORT,
  ()=>{
   console.log(
    "Auth Service Running"
   );
  }
 );

}

app.post(

"/register",

async(req,res)=>{

 const {

  username,

  password

 }=req.body;

 const hashed=

 await bcrypt.hash(

  password,

 10

 );

 await db.collection(

  "users"

 ).insertOne({

  username,

  password:hashed

 });

 res.json({

  message:"user created"

 });

}

);



app.post(

"/login",

async(req,res)=>{

 const {

  username,

  password

 }=req.body;

 const user=

 await db.collection(

  "users"

 ).findOne({

   username

 });

 if(!user){

  return res.status(401)

  .json({

   message:"invalid credentials"

  });

 }

 const valid=

 await bcrypt.compare(

  password,

  user.password

 );

 if(!valid){

  return res.status(401)

  .json({

   message:"invalid credentials"

  });

 }
  
 const token=

jwt.sign(

 {

  userId:user._id,

  username:user.username

 },

 "supersecret",

 {

  expiresIn:"1h"

 }

);

res.json({

 token

});


}

);

app.get(

"/me",

auth,

(req,res)=>{

 res.json({

  user:req.user

 });

}

);

start();