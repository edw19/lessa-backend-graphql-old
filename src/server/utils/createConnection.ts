import mongoose from 'mongoose'
import { MONGODB_URI } from 'config/variables';

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
