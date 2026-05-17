import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { socketAuth } from '../middleware/socketMiddilware.js'

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

io.use(socketAuth)

const users = {} // store online users

io.on('connection', (socket) => {
    const userId = socket.userId;
    const fullname = socket.fullname; 
    console.log(`⚡ User Connected: ${fullname} (ID: ${userId})`);
    users[userId] = socket.id;
    io.emit('onlineUsers', Object.keys(users));
    
    // socket.on('sendMessage', (data) => {
    //     io.emit('receiveMessage', data);
    // });

    socket.on('disconnect', () => {
       
        console.log(`❌ User Disconnected: ${fullname} (ID: ${userId})`);
        delete users[userId];
        io.emit('onlineUsers', Object.keys(users));
    });
});

export const getReciverId = (userId) => {
    return users[userId]
}

export {
    app,
    io,
    server,
}