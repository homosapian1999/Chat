const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const chatUpdates = require("./updates/chat");

const directMessageHandler = async (socket, data) => {
  try {
    console.log(`direct message is being handled`);
    // console.log(data);
    const { userId } = socket.user;
    const { reciverUserId, content } = data;

    // create new message
    const message = await Message.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    // Find if conversation exists between the two user- if not then create new;
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, reciverUserId] },
    });
    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      // perform and update to sender and receiver if it is online
      chatUpdates.updateChatHistory(conversation._id.toString());
    } else {
      // create new conversation
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, reciverUserId],
      });

      // perform and update to sender and receiver if it is online
      chatUpdates.updateChatHistory(newConversation._id.toString());
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directMessageHandler;
