import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io"; 
import generateResponse from "./service/gemini.js";

const server = http.createServer(app);
const io = new Server(server);  

const chatHistory = []; // Array to store chat history


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("ai-message", async (data) => {
    console.log("Received message from client:", data);
    try {
      // Store the message in chat history
      chatHistory.push(
        { role: "user",
          part:[{text: data}]
        }
      );

      const response = await generateResponse(chatHistory);
      chatHistory.push(
        { role: "model",
          part:[{text: response}]
        }
      );

      socket.emit("ai-response", response);
    } catch (error) {
      console.error("Error generating AI response:", error);
      socket.emit("ai-response", "Error generating response");
    }
  });
});

const PORT =  3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});