import { createTunnel } from 'tunnel-ssh';
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const private_key = process.env.VPS_PRIVATE_KEY;

const connectDB = async (url) => {
  mongoose.set('strictQuery', false);

  if (private_key) {
    const privateKey = fs.readFileSync(private_key);

    const sshOptions = {
      host: 'appskynote.com',
      port: 22,
      username: process.env.VPS_USERNAME,
      privateKey: privateKey,
    };

    const mySimpleTunnel = (sshOptions, port, autoClose = true) => {
      let forwardOptions = {
        srcAddr: '127.0.0.1',
        srcPort: port,
        dstAddr: '127.0.0.1',
        dstPort: port,
      };

      let tunnelOptions = {
        autoClose: autoClose,
      };

      let serverOptions = {
        host: '127.0.0.1',
        port: port,
      };

      return createTunnel(
        tunnelOptions,
        serverOptions,
        sshOptions,
        forwardOptions
      );
    };
    await mySimpleTunnel(sshOptions, 27017);
    console.log('tunnel ssh established.');
  } else {
    console.log('private key not found from .env file');
  }

  console.log(`Let's try to connect to ${url}`);

  const connectionDone = mongoose
    .connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
      // ,
      // (err) => {
      //   if (err) {
      //     console.error("FAILED TO CONNECT TO MONGODB");
      //     console.error(err);
      //   } else {
      //     console.log("CONNECTED TO MONGODB");
      //   }
      // }
    )
    .then(() => {
      console.log('Connected to the DB then!');
      console.log(mongoose.connection.readyState);
    })
    .catch((err) => console.log('error in mongoose connect', err));

  //console.log("MongoDB connection established");
  return connectionDone;
};

export default connectDB;
