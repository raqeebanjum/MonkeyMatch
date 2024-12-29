const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    // Listen for "start" event
    socket.on("start", (data) => {
      console.log(`Simulation started with sentence: ${data.sentence} and ${data.monkeyCount} monkeys.`);
      // Logic for simulation will go here
    });
  
    // Listen for "stop" event
    socket.on("stop", () => {
      console.log("Simulation stopped.");
      // Logic to stop simulation will go here
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });



const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));