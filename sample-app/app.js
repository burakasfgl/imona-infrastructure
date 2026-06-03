const express = require("express");
const { MongoClient } = require("mongodb");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { SQSClient, SendMessageCommand } =
require("@aws-sdk/client-sqs");

const app = express();
const cognitoIssuer =
"https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_MAcRqCV0a";

const authMiddleware = jwt({

    secret:jwksRsa.expressJwtSecret({

        cache:true,

        rateLimit:true,

        jwksRequestsPerMinute:5,

        jwksUri:`${cognitoIssuer}/.well-known/jwks.json`

    }),

    audience:"67va9g4sejgh8dnpaq6drbg698",

    issuer:cognitoIssuer,

    algorithms:["RS256"]

});

app.use(express.json());

const uri = process.env.MONGO_URI;

const sqs = new SQSClient({

 region:"eu-central-1"

});

const queueUrl =
process.env.QUEUE_URL;

let db;

async function connectMongo(){

    const client = new MongoClient(uri);

    await client.connect();

    db = client.db("imona");

    console.log("Mongo Connected");

}

connectMongo();

app.get("/",(req,res)=>{

    res.send("Imona Gamification Running 🚀");

});
app.get("/profile",

authMiddleware,

(req,res)=>{

    res.json({

        message:"protected route",

        user:req.auth

    });

});

app.post("/xp", async (req,res)=>{

    const { user, points } = req.body;

    await db.collection("xp").insertOne({

        user,

        points,

        createdAt:new Date()

    });

    res.json({

        message:"xp added"

    });

});

app.post("/mission-complete",

async(req,res)=>{

const event=req.body;

await sqs.send(

new SendMessageCommand({

QueueUrl:queueUrl,

MessageBody:JSON.stringify(event)

})

);

res.json({

message:"event queued"

});

});

app.get("/leaderboard", async (req,res)=>{

    const leaderboard = await db
      .collection("xp")
      .aggregate([

        {

          $group:{

            _id:"$user",

            totalXP:{

              $sum:"$points"

            }

          }

        },

        {

          $sort:{

            totalXP:-1

          }

        }

      ])
      .toArray();

    res.json(leaderboard);

});


app.listen(3000,()=>{

    console.log("Server running on port 3000");

});