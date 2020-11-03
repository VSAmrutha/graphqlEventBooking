const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose")
const {graphqlHTTP}=require("express-graphql");
//graphql is a object so we are destructing

const graphqlSchema=require("./graphql/schema/index")
const graphqlResolvers=require("./graphql/resolvers/index")
const app=express();
app.use(bodyParser.json());


app.use("/graphql",graphqlHTTP({
    schema:graphqlSchema,
    rootValue:graphqlResolvers,
    graphiql:true
}))

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.zmgxp.mongodb.net:27017,cluster0-shard-00-01.zmgxp.mongodb.net:27017,cluster0-shard-00-02.zmgxp.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=atlas-ayy811-shard-0&authSource=admin&retryWrites=true&w=majority`)
.then(()=>{
    app.listen(3000,()=>console.log("Port Running in 3000"))
}).catch(err=>console.log(err))

