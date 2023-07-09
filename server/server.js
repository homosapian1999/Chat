const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketServer = require("./socketServer");
const authRoutes = require("./routes/authRoute");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");

// Configure the dotenv file;
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

// Creating the routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);

// Create the server
const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is up and running with hompsapian as admin`);
    });
  })
  .catch((err) => {
    console.log(
      `Error while connecting with the database and the server ${err}`
    );
  });
