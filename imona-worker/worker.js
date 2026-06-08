require("dotenv").config();
const {
 SQSClient,
 ReceiveMessageCommand,
 DeleteMessageCommand
}=require("@aws-sdk/client-sqs");

const { MongoClient }=require("mongodb");

const redis=require("redis");

const sqs=new SQSClient({

 region:"eu-central-1"

});

const queueUrl = (()=>{

 try{

  const parsed = JSON.parse(
   process.env.QUEUE_URL
  );

  return parsed.QUEUE_URL;

 }

 catch{

  return process.env.QUEUE_URL;

 }

})();

console.log(
 "QUEUE:",
 queueUrl
);

const mongo=new MongoClient(

 process.env.MONGO_URI

);

const redisClient=redis.createClient({

 url:`redis://${process.env.REDIS_HOST}:6379`

});

async function start(){

 await mongo.connect();

try{

 await redisClient.connect();

 console.log(

  "Redis Connected"

 );

}

catch{

 console.log(

  "Redis Skipped"

 );

}
 console.log("Worker Started");

 const db=mongo.db("imona");

 while(true){
  console.log(
 "polling..."
);

 const response=

await sqs.send(

new ReceiveMessageCommand({

 QueueUrl:queueUrl,

 MaxNumberOfMessages:1,

 WaitTimeSeconds:1,

 VisibilityTimeout:5

})

);

console.log(

"RESPONSE:",

response

);

 if(

 !response.Messages ||

 response.Messages.length===0

){

 console.log(

  "no messages"

 );

 continue;

}

console.log(

 "MESSAGE FOUND"

);

 for(const msg of response.Messages){

   console.log(

 "RAW:",

 msg.Body

);

const event = JSON.parse(
 msg.Body
);

console.log(
 "EVENT RAW:",
 event
);

const body =
 event.detail;

console.log(
 "DETAIL:",
 body
);

   console.log(

    "EVENT:",

    body

   );

   await db.collection("missions")

   .insertOne({

    ...body,

    completedAt:new Date()

   });

   await db.collection("rewards")

.insertOne({

 user:body.user,

 reward:body.reward,

 xp:body.xp,

 createdAt:new Date()

});

   console.log(

 "Reward Consumed:",

 body.reward,

 "XP:",

 body.xp

);

   await sqs.send(

    new DeleteMessageCommand({

     QueueUrl:queueUrl,

     ReceiptHandle:

     msg.ReceiptHandle

    })

   );

   console.log(

    "Processed"

   );

 }

 }

}

start();