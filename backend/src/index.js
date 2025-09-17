import express from 'express'
import {createServer} from 'http'
import dotenv from 'dotenv'
import {Server} from 'socket.io'
import cors from 'cors'
import config from './config/dbConfig.js'
import userRoutes from './APIs/user/routes/userRoutes.js'
import chatRoutes from './APIs/chats/routes/chatRoutes.js'
import requestRoutes from './APIs/requests/routes/requestRoutes.js'
import cookieParser from 'cookie-parser'
// import { fileURLToPath } from 'url'
// import { dirname,join } from 'path'

dotenv.config()
const app  = express()
const server = createServer(app)
config.dbConfig()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET','POST','PATCH','PUT','DELETE'],
    credentials:true
}))

// const __dirname = dirname(fileURLToPath(import.meta.url))
// const 
const io = new Server(server,{
      cors: { origin: "*" },
})

app.use((req,res,next)=>{
req.io = io
next()
})

io.on('connection',(socket)=>{
    console.log("A user connected: "+socket.id)
    socket.on('joinRoom',(userId)=>{
        socket.join(userId)
    });
      socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
})
app.use('/v1/',userRoutes)      
app.use('/v1/chats/',chatRoutes)
app.use('/v1/requests/',requestRoutes)
const PORT  = process.env.PORT || '8100'
server.listen(PORT,()=>{
    console.log(`Server is started on ${PORT}`)
})