const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());

const uri = process.env.MONGO_URI;

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