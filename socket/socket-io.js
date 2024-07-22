"use strict";
const http = require("http");
const { Message, Room } = require("../schemas/model");
const activeUsers = new Set();
// const chatCtrl = require("../api/chat");

module.exports = (server, logger) => {
  logger.info("Socket.io server started");
  const io = require("socket.io")(server);


  io.use((socket, next) => {
    logger.info(
      `REQ [${socket.id}] [WS] ${socket.handshake.url} ${JSON.stringify(
        socket.handshake
      )}`
    );
    next();
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    logger.info(`CONN [${socket.id}] [WS] ${socket.handshake.url} ${JSON.stringify(socket.handshake)}`);
    let { token } = socket?.handshake?.query;
    // if (Authorization && Authorization.startsWith("Bearer ")) {
    //   Authorization = Authorization.slice(7, Authorization.length);
    // }
    const { id } = jwt.decodeToken(token);
    // await User.findByIdAndUpdate(
    //   id,
    //   {
    //     socket_id: socket.id,
    //   },
    //   { new: true }
    // );
    // Routes
    socket.on('join', async function ({ users }) {
      // logger.info(`user join room : ${roomId}`);
      // socket.userId = roomId;
      // activeUsers.add(roomId);


      try {
        let room = await Room.find({ users: { $all: users } })
        console.log(room, "useruser")
        if (room.length <= 0) {
          room = await Room.create({ users: users })
          console.log(room, "roomroomroomroom")
        }
        socket.join(room?._id);
        // let chats = await chatCtrl.getRoom.handler(roomId);
        // let chatHistory = await chatCtrl.getMessages.handler(roomId);
        // let history = await chatCtrl.history.handler(roomId);
        // chats = JSON.parse(JSON.stringify(chats));
        // chatHistory.payload.chats = chatHistory.payload.chats.map((chat) => {
        //     chat["network"] = "1"
        //     return chat;
        // })
        // console.log("history", chatHistory.payload.chats)
        // io.in(socket.id).emit('history', { chats: chatHistory.payload.chats });
        console.log("history sent");
      } catch (error) {
        console.log('Error in finding Chats ', error);
      }
    });

    socket.on('new-message', async function ({ roomId, sender, message, type }) {
      console.log({ roomId, sender, message })
      try {

        let newMsg = await Message.create({
          roomId: roomId,
          sender: sender,
          // receiver:"other",
          message: message,
          type: type
        })
        console.log(newMsg, "newMsgnewMsg")
        await Room.findByIdAndUpdate({ _id: roomId }, { lastMessage: newMsg._id })
        // let newMsg = await chatCtrl.sendMessage.handler({
        //     roomId: roomId,
        //     sender: sender,
        //     message: message,
        //     type: type
        // });
        // newMsg = JSON.parse(JSON.stringify(newMsg));
        // newMsg["network"] = "1"
        // console.log("new-message", newMsg.payload.newChat)
        io.in(socket.id).emit('new-message', newMsg);
        socket.broadcast.emit('new-message', newMsg);         
        // setTimeout(() => {

        // }, 1000)
        console.log("message-sent")
      } catch (error) {
        console.log('Error in sending message', error);
      }
    });

    // Socket "Call Connect"
    // socket.on(
    //   "connectCall",
    //   async function ({ channelName, otherId, isForVideoCall, token }) {
    //     console.log("channelname on connectcall...", channelName);
    //     console.log("otherid on connectcall...", otherId);
    //     console.log("token on connectcall...", token);
    //     if (token) {
    //       let data = {
    //         msg: "call Requested",
    //         channelName: String(channelName),
    //         otherId: String(otherId),
    //         isForVideoCall: Boolean(isForVideoCall),
    //         token: token,
    //       };
    //       io.in(String(channelName)).emit("onCallRequest", data);
    //       io.in(String(otherId)).emit("onCallRequest", data);
    //       console.log("data on connectcall...", data);
    //     }
    //   }
    // );

    //  socket "acceptCall"
    // socket.on(
    //   "acceptCall",
    //   async function ({ channelName, otherId, isForVideoCall, token }) {
    //     console.log("chanel name................. Accept", channelName);
    //     console.log("otherId............++++++++++Accept", otherId);
    //     console.log("isForVideoCall------------->", isForVideoCall);
    //     console.log("token...........++++++++++++ accept", token);
    //     const res = {
    //       msg: "call accepted",
    //       channelName: String(channelName),
    //       otherId: String(otherId),
    //       isForVideoCall: Boolean(isForVideoCall),
    //       token: token,
    //     };
    //     io.in(String(channelName)).emit("onAcceptCall", res);
    //     io.in(String(otherId)).emit("onAcceptCall", res);
    //     console.log("channelNameonAcceptCall...................", res);
    //     console.log("otherIdonAcceptCall...................", res);
    //   }
    // );

    // Socket "Call Reject"
    // socket.on(
    //   "rejectCall",
    //   async function ({ channelName, otherId, isForVideoCall, token }) {
    //     console.log("chanel name............ reject", channelName);
    //     console.log("otherId........++++++++++ reject", otherId);
    //     console.log("token.........+++++++++++ reject", token);
    //     const res = {
    //       msg: "call disconnected",
    //       channelName: String(channelName),
    //       otherId: String(otherId),
    //       isForVideoCall: Boolean(isForVideoCall),
    //       token: token,
    //     };
    //     io.in(String(channelName)).emit("onRejectCall", res);
    //     io.in(String(otherId)).emit("onRejectCall", res);

    //     console.log("channelNamedisconnect...................", res);
    //     console.log("otherIddisconnect...................", res);
    //   }
    // );

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("error", function (err) {
      console.log("received error from socket:", socket.id);
      console.log(err);
    });

    // // when the client emits 'stop typing', we broadcast it to others
    // socket.on('stop typing', () => {
    //     console.log("stop typing")
    //     socket.broadcast.emit('stop typing', {
    //     username: socket.username
    //     });
    // });
    // // when the client emits 'typing', we broadcast it to others
    // socket.on('typing', () => {
    //     console.log("typing")
    //     socket.broadcast.emit('typing', {
    //     username: socket.username
    //     });
    // });
    // // when the client emits 'new message', we broadcast it to others
    // socket.on('new message', (data) => {
    //     console.log("new message",data)
    //     socket.broadcast.emit('new message', {
    //     username: socket.username,
    //     message: data
    //     });
    // });

    // // when user send message
    // socket.on('send-message', (data) => {
    //     console.log("send message",data)
    //     io.emit('message', data);
    // });
  });
};
