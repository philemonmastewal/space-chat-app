import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    // const data = queryString.parse(location.search);

    // console.log(location.search);
    // console.log(data);
    // ^^ we can write this first test version better, below>

    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, error => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [messages]);

  // we need to create a function for sending messages, and add our jsx in the return function below
  const sendMessage = event => {
    event.preventDefault(); //this will help the clearing of content due to browser refreshes from clicks on website

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
    // alert(
    //   "Sorry, you need to sign to send messages: You can try refreshing the page or returning to the Join page"
    // );
  };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="stars">
        <div className="star star1"></div>
        <div className="star star2"></div>
        <div className="star star3"></div>
        <div className="star star4"></div>
        <div className="star star5"></div>
        <div className="star star6"></div>
        <div className="star star7"></div>
        <div className="star star8"></div>

        <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />

          {/* <input                // <<<< this will be handeled in input component instead of here
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyPress={event => (event.key === "Enter" ? sendMessage() : null)}
        /> */}
        </div>
        <TextContainer users={users} />
      </div>
    </div>
  );
};

export default Chat;
