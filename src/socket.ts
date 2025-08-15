import { io } from "socket.io-client";

const URL = "localhost:4000"; 
export const socket = io(URL);
