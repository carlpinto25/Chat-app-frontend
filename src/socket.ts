import { io } from "socket.io-client";

const URL = "https://chat-app-lzdf.onrender.com"; 
export const socket = io(URL);
