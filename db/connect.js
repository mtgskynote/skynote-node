import { createTunnel } from 'tunnel-ssh';
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import chalk from 'chalk';
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
    console.log(chalk.blue('SSH tunnel established'));
  } else {
    console.log(chalk.red('Private key not found in .env file'));
  }

  const connectionDone = mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(chalk.blue('Successfully connected to MongoDB'));
    })
    .catch((err) => console.log(chalk.red('Error connecting to MongoDB', err)));

  return connectionDone;
};

export default connectDB;
