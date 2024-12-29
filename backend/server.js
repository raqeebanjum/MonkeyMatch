const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Worker } = require("worker_threads");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Track workers and client states
const clientData = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("start", ({ text, monkeyCount }) => {
    console.log("Start event received:", text, "with", monkeyCount, "monkey(s)");

    if (!clientData[socket.id]) {
      clientData[socket.id] = {
        workers: [],
        matches: 0,
        totalMonkeys: monkeyCount,
      };
    }

    for (let i = 0; i < monkeyCount; i++) {
      const monkeyId = i + 1;

      // Spawn an independent worker
      const worker = new Worker("./monkeyWorker.js", {
        workerData: { target: text, monkeyId },
      });

      worker.on("message", (data) => {
        if (data.type === "progress") {
          socket.emit("progress", data.payload);
        } else if (data.type === "match") {
          socket.emit("match", data.payload);
          clientData[socket.id].matches++;

          if (clientData[socket.id].matches === monkeyCount) {
            socket.emit("stopped", { message: "All monkeys have stopped working." });
            terminateAllWorkers(socket.id);
          }
        }
      });

      worker.on("error", (err) => {
        console.error(`Worker error (Monkey #${monkeyId}):`, err);
        socket.emit("crash", { monkey: monkeyId, message: err.message });
      });

      worker.on("exit", (code) => {
        console.log(`Worker for Monkey #${monkeyId} exited with code ${code}`);
      });

      clientData[socket.id].workers.push(worker);
    }
  });

  const terminateAllWorkers = (clientId) => {
    if (clientData[clientId]) {
      clientData[clientId].workers.forEach((worker) => {
        try {
          worker.terminate();
        } catch (error) {
          console.error(`Error terminating worker: ${error.message}`);
        }
      });
      clientData[clientId].workers = [];
      clientData[clientId].matches = 0;
    }
  };

  socket.on("stop", () => {
    console.log("Stop event received");
    terminateAllWorkers(socket.id);
    socket.emit("stopped", { message: "Monkeys have stopped working." });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    terminateAllWorkers(socket.id);
    delete clientData[socket.id];
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});