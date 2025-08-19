import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io"; 
import generateResponse from "./service/gemini.js";
import cors from "cors";

const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(cors()); // Enable CORS for REST endpoints

const chatHistory = []; // Array to store chat history


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("ai-message", async (data) => {
    console.log("Received message from client:", data);
    try {
      // Handle both string and object message formats
      const messageText = typeof data === 'string' ? data : 
                         (data.prompt ? data.prompt : JSON.stringify(data));
      
      // Store the message in chat history
      const userMessage = {
        role: "user",
        part: [{ text: messageText }]
      };
      
      chatHistory.push(userMessage);

      const response = await generateResponse([...chatHistory]); // Pass a copy of chat history
      
      // Store AI response in chat history
      const aiMessage = {
        role: "model",
        part: [{ text: response }]
      };
      chatHistory.push(aiMessage);

      socket.emit("ai-response", response);
    } catch (error) {
      console.error("Error generating AI response:", error);
      socket.emit("ai-response", "I apologize, but I encountered an error. Could you please try again?");
    }
  });
});

const PORT =  3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});