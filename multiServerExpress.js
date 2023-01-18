const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
//const { Server } = require('socket.io');
//const socketio = new Server(server); 

var portnum = process.argv[2] || 3000; // Get portnum from the command line if it is there, otherwise use 3000 as default
 
// Use www as the "root" directory for all requests.
// if no path is given, it will look for index.html in that directoy.
app.use(express.static('www'));

// Start the server listening on a port 
server.listen(portnum, function(){
	console.log ("server listening on port " + portnum);
});

/*
// When we get a connection, 
socketio.on('connection', function (socket) {
	//create a listener for this particular socket
	console.log("Got a connection on socket : " + socket);
	
    socket.on('message', function (msg) {
        console.log('Message Received: ', msg);
        socket.broadcast.emit('message', msg);
    });
});

*/