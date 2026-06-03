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

const mongo=new MongoClient(

 process.env.MONGO_URI

);

const redisClient=redis.createClient({

 url:`redis://${process.env.REDIS_HOST}:6379`

});

async function start(){

 await mongo.connect();

 await redisClient.connect();

 console.log("Worker Started");

 const db=mongo.db("imona");

 while(true){

 const response=await sqs.send(

 new ReceiveMessageCommand({

 QueueUrl:queueUrl,

 MaxNumberOfMessages:1,

 WaitTimeSeconds:20

 })

 );

 if(!response.Messages){

   continue;

 }

 for(const msg of response.Messages){

   const body=JSON.parse(

     msg.Body

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

   await db.collection("xp")

   .insertOne({

    user:body.user,

    points:body.rewardXP,

    createdAt:new Date()

   });

   const cacheKey=

   `leaderboard:${body.user}`;

   const current=

   await redisClient.get(

    cacheKey

   );

   await redisClient.set(

    cacheKey,

    Number(current||0)

    +

    body.rewardXP

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