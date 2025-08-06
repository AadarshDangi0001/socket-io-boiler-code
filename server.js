import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io"; 

const server = http.createServer(app);
const io = new Server(server);  

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT =  3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});