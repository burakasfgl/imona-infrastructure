require("dotenv").config();

const express=require("express");

const {MongoClient}=require("mongodb");

const bcrypt=require("bcrypt");

const jwt=require("jsonwebtoken");

const {

 CognitoJwtVerifier

}=require(

 "aws-jwt-verify"

);

const app=express();

const verifier=

CognitoJwtVerifier.create({

 userPoolId:

 process.env.COGNITO_USER_POOL_ID,

 tokenUse:

 "access",

 clientId:

 process.env.COGNITO_CLIENT_ID

});

app.use(express.json());
async function auth(

 req,

 res,

 next

){

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

  const payload=

  await verifier.verify(

   token

  );

  req.user=

  payload;

  next();

 }

 catch(error){

  console.log(

   error

  );

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