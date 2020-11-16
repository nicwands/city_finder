// import fs from 'fs';
// import colors from 'colors';
import { logMessage } from './dbMessages';
const io = require('socket.io')();
let clientCount = 0;

export const socketListen = (port) => {
    io.listen(port);
    console.log(`Socket listening on port ${port}`);
};

export const connectNameSpace = (nameSpace, room) => {
    let currentlyTyping = [];
    let currentRoom = room;

    const newSpace = io.of(`/${nameSpace}`);

    newSpace.once('connection', function (socket) {
        clientCount ++;
        console.log(`connected to ${nameSpace} room: ` + room.yellow);
        console.log("active users: ", clientCount);
        socket.join(room);
        // console.log(__dirname);
        // fs.readFile('../cat_test.jpg', function(err, buf){
        //     if (err) throw err;
        //     console.log(buf);
        //     // it's possible to embed binary data
        //     // within arbitrarily-complex objects
        //     socket.emit('image', { image: true, buffer: buf.toString('base64') });
        //     console.log('image file is initialized');
        // });
        socket.on('user typing', function(user) {
            currentlyTyping.push(user);
            socket.to(currentRoom).emit('user typing', currentlyTyping);
        });
        socket.on('user blur', function(user) {
            currentlyTyping = currentlyTyping.filter(value => {
                return value !== user
            });
            socket.to(currentRoom).emit('user blur', currentlyTyping);
        });
        socket.on('chat message', function(msg) {
            console.log("Message: ", msg);
            logMessage(msg, nameSpace, currentRoom).then((returned) => {
                console.log(returned);
            });
            socket.to(currentRoom).emit('chat message', msg);
            // socket.broadcast.emit('chat message', msg);
        });
        socket.on('change room', function (room) {
            console.log(room);
            currentRoom = room.current;
            socket.leave(room.prev);
            socket.join(room.current);
        });
        socket.on('disconnect', function(){
            clientCount --;
            console.log('user disconnected'.cyan);
        });
    });
};