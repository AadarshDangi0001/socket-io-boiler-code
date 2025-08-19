import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io"; 
import generateResponse from "./service/gemini.js";

const server = http.createServer(app);
const io = new Server(server);  

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("ai-message", async (data) => {
    console.log("Received message from client:", data);
    try {
      const response = await generateResponse(data);
      console.log("AI response:", response);
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