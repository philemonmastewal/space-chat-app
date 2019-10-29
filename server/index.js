// import express from "express";
// import socketio from "socket.io";
// import http from "http";
// ^^^SyntaxError: Cannot use import statement outside a module
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connect", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room); //builtin method that joins to a room that is passed in from user object through user.room

    socket.emit("message", {
      user: "welcome-bot",
      text: `${user.name}, welcome to the room: ${user.room}`
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "watch-bot",
      text: `${user.name}, has arrived!`
    }); //.broadcast will send to everyone besides the sender, here we are using it to notify everyone else in the room that this user has entered the room

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();

    // if (error) {
    //   callback({ error: "error" });
    // }   // all of this if statement conects to socket.emit in chat.js file

    //callback();  /we are going to put it above for now      // <<< you can do some error handling in this callback that is triggered on 'join'
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user.room !== undefined && user.name !== undefined) {
      console.log("error: no room or name saved");

      io.to(user.room).emit("message", {
        user: user.name,
        text: message
      });
    }
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "exit-bot",
        text: `${user.name} has left.`
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
    console.log("User has left!!!");
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
