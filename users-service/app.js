require("dotenv").config();

const express=require("express");

const {MongoClient}=require("mongodb");

const {

 CognitoJwtVerifier

}=require("aws-jwt-verify");

const app=express();

app.use(express.json());

const verifier=

CognitoJwtVerifier.create({

 userPoolId:

 process.env.COGNITO_USER_POOL_ID,

 tokenUse:

 "access",

 clientId:

 process.env.COGNITO_CLIENT_ID

});

const mongo=

new MongoClient(

 process.env.MONGO_URI

);

let db;

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

 catch{

  return res.status(401)

  .json({

   message:"invalid token"

  });

 }

}

app.post(

"/seed",

async(req,res)=>{

 await db.collection(

  "users"

 ).insertOne({

  cognitoId:

  "a394f882-60e1-7045-cc35-1bc2254ddae1",

  username:

  "burak",

  company:

  "imona",

  xp:0,

  level:1

 });

 res.json({

  message:"seeded"

 });

}

);

app.post(

"/seed",

async(req,res)=>{

 await db.collection(

  "users"

 ).insertOne({

  cognitoId:

  "a394f882-60e1-7045-cc35-1bc2254ddae1",

  username:

  "burak",

  company:

  "imona",

  xp:0,

  level:1

 });

 res.json({

  message:"seeded"

 });

}

);

app.get(

"/users/me",

auth,

async(req,res)=>{

 const user=

 await db.collection(

  "users"

 ).findOne({

  cognitoId:

  req.user.sub

 });

 res.json({

  user

 });

}

);

async function start(){

 await mongo.connect();

 db=mongo.db(

  "imona"

 );

 console.log(

  "Users Service Running"

 );

 app.listen(

  process.env.PORT

 );

}

start();