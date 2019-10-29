// In this file we will create helper functions to help us manage users (seeing whos in what room, whos signing in/out, etc...)

const users = [];

const addUser = ({ id, name, room }) => {
  // first we need to change the name and room submitted info into usable info, for ex: below
  // turn entry of 'Philemon Mastewal' into => 'philemonmastewal'
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  console.log("userName is: " + name);
  console.log("roomName is: " + room);

  // next we will see if there is a pre-existing user with the same name in the same room as the person is trying to join
  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (!name || !room) return { error: "Must provide username and room. " };
  if (existingUser)
    return {
      error: "Username is taken, hit your back button and pick another please"
    };

  // if the username is not taken, we will instantiate the new user below, and then we will push them into our users array
  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = id => {
  // in here we will find our user using the passed in id
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => users.find(user => user.id === id); // we can do this one in one line

const getUsersInRoom = room => users.filter(user => user.room === room);

// now we need to export these helper functions, so they can be used in other files, particularyly index.js (by importing them over there)
module.exports = { addUser, removeUser, getUser, getUsersInRoom };
