const http = require("http");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

async function connectMongo() {

  try {

    const client = new MongoClient(uri);

    await client.connect();

    console.log("Mongo Connected");

  } catch (err) {

    console.error(err);

  }

}

connectMongo();

const server = http.createServer((req,res)=>{

  res.writeHead(200, {
    "Content-Type":"text/plain; charset=utf-8"
  });

  res.end("Mongo Connected 🚀");

});

server.listen(3000, ()=>{

  console.log("Server running on port 3000");

});