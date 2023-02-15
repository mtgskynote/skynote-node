import fs from "fs";
import http from "http";
import https from "https";
import { program } from "commander";

const serverAuthentication = (app) => {
  var theServer;

  program.option("--nocerts").option("-p, --port <number>");
  program.parse();
  const options = program.opts();

  //Certificate for Domain 1
  if (!program.opts().nocerts) {
    // don't check for certs on your local machine
    const privateKey1 = fs.readFileSync(
      "/etc/letsencrypt/live/appskynote.com/privkey.pem",
      "utf8"
    );
    const certificate1 = fs.readFileSync(
      "/etc/letsencrypt/live/appskynote.com/cert.pem",
      "utf8"
    );
    const ca1 = fs.readFileSync(
      "/etc/letsencrypt/live/appskynote.com/chain.pem",
      "utf8"
    );
    const credentials1 = {
      key: privateKey1,
      cert: certificate1,
      ca: ca1,
    };
    theServer = https.createServer(credentials1, app);
  } else {
    theServer = http.createServer(app);
  }

  return [options, theServer];
};

export default serverAuthentication;
