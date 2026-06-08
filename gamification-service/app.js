require("dotenv").config();

const express=require("express");

const {MongoClient}=require("mongodb");

const {

CognitoJwtVerifier

}=require("aws-jwt-verify");

const {

createClient

}=require("redis");

const {
 EventBridgeClient,
 PutEventsCommand
}=require("@aws-sdk/client-eventbridge");

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

const redis=

createClient({

 url:

 `redis://${process.env.REDIS_HOST}:6379`

});

const eventBridge=

new EventBridgeClient({

 region:"eu-central-1"

});


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

 try{

  const token=

  header.split(" ")[1];

  req.user=

  await verifier.verify(

   token

  );

  next();

 }

 catch{

  return res.status(401)

  .json({

   message:"invalid token"

  });

 }

}

function calculateXp(

 action

){

 switch(action){

  case "mission_complete":

   return 100;

  case "daily_login":

   return 10;

  case "quiz_complete":

   return 50;

  default:

   return 0;

 }

}

app.post(

"/xp/add",

auth,

async(req,res)=>{

 console.log("1 auth geçti");

 const {action}=req.body;

 console.log("2 action:",action);

 const xp=

 calculateXp(

 action

 );

 console.log("3 xp:",xp);

 await db.collection(

 "users"

 ).updateOne(

 {

  cognitoId:

  req.user.sub

 },

 {

  $inc:{

   xp:xp

  }

 }

 );

 console.log("4 mongo update");

 const user=

 await db.collection(

 "users"

 ).findOne({

  cognitoId:

  req.user.sub

 });

 console.log("5 user bulundu");

 if(

 user.xp>=500

){

 console.log(

 "reward unlock"

 );

console.log("sending sqs...");

const result=

console.log(

"sending eventbridge..."

);

await eventBridge.send(

new PutEventsCommand({

 Entries:[

 {

 Source:

 "imona.gamification",

 DetailType:

 "reward",

 Detail:

 JSON.stringify({

  user:user.username,

  reward:"silver_badge",

  xp:user.xp

 }),

 EventBusName:

 "default"

 }

 ]

})

);

console.log(

"EVENTBRIDGE SENT"

);

}

console.log("6 redis skip");

 console.log("7 response");

 res.json({

  addedXp:xp,

  totalXp:user.xpS

 });

}

);
async function start(){

 await mongo.connect();

 db=mongo.db(

 "imona"

 );

 try{

  await redis.connect();

  console.log(

   "Redis Connected"

  );

 }

 catch{

  console.log(

   "Redis Skipped"

  );

 }

 console.log(

 "Gamification Running"

 );

 app.listen(

 process.env.PORT,

 ()=>console.log(

 "Listening 3003"

 )

 );

}

start();