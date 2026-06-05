require("dotenv").config();

const express=require("express");

const {

 SQSClient,

 SendMessageCommand

}=require("@aws-sdk/client-sqs");

const app=express();

app.use(express.json());

const sqs=new SQSClient({

 region:process.env.AWS_REGION

});

app.get("/",(req,res)=>{

 res.json({

  service:"notification",

  status:"running"

 });

});

app.post(

"/notify",

async(req,res)=>{

 try{

 const {

  user,

  message

 }=req.body;

 await sqs.send(

 new SendMessageCommand({

  QueueUrl:

   process.env.QUEUE_URL,

  MessageBody:

   JSON.stringify({

    user,

    message,

    createdAt:

    new Date()

   })

 })

);

 res.json({

  message:

  "notification queued"

 });

 }

 catch(err){

  console.log(err);

  res.status(500)

  .json({

   message:

   "failed"

  });

 }

}

);

app.listen(

 process.env.PORT,

 ()=>{

 console.log(

 "Notification Service Running"

 );

 }

);