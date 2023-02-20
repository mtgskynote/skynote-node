import mongoose from "mongoose";
import tunnel from "tunnel-ssh";
import fs from "fs";

// const dev = process.env.NODE_ENV !== 'production';

// if (dev) {

// } else {
//   mongoose.connect('your-production-instance-uri'); //normal from before
// }

const connectDB = (url) => {
  mongoose.set("strictQuery", false);

  const privateKey = fs.readFileSync("./id_ed25519");

  console.log("privateKey", privateKey);

  const sshOptions = {
    host: "appskynote.com",
    port: 22,
    username: "dilipharish",
    privateKey: privateKey,
  };

  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    auth: {
      authSource: "skynote",
      mechanism: "SCRAM-SHA-256",
    },
  };

  return mongoose.connect(url, connectionParams, (error) => {
    if (error) {
      console.log("error", error);
      process.exit(1);
    }

    console.log("MongoDB connection established");
    //important from above line is the part 127.0.0.1:50001
  });

  //   const sshTunnelConfig = {
  //     // agent: process.env.SSH_AUTH_SOCK,
  //     username: "dilipharish",
  //     privateKey: privateKey,
  //     host: "appskynote.com", //IP adress of VPS which is the SSH server
  //     port: 22,
  //     dstHost: "127.0.0.1",
  //     dstPort: "22017", //or 27017 or something like that
  //     localHost: "127.0.0.1",
  //     localPort: "27017", //or anything else unused you want
  //   };

  //   var tnl = tunnel(sshTunnelConfig, (error, server) => {
  //     if (error) {
  //       console.log("SSH connection error: ", error);
  //     }

  //     console.log(server);

  //   });
};

export default connectDB;
