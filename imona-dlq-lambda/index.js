exports.handler = async(event)=>{

 console.log(

  "DLQ MESSAGE RECEIVED"

 );

 console.log(

  JSON.stringify(

   event,

   null,

   2

  )

 );

 return {

  statusCode:200,

  body:"processed"

 };

};