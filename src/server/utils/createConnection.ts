// import { MONGODB_URI } from "config/variables";
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://lessa-dev:xFBRP4gBGSO8KLmX@cluster0-shard-00-00.mqoho.mongodb.net:27017,cluster0-shard-00-01.mqoho.mongodb.net:27017,cluster0-shard-00-02.mqoho.mongodb.net:27017/lessa-dev?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.set("strictQuery", false)

export async function createConnection() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    // bufferMaxEntries: 0,
    // useFindAndModify: false,
    // useCreateIndex: true,
  };

  await mongoose.connect(MONGODB_URI, options)
  console.log("db is connected")

}
