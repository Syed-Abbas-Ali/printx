import bodyParser from 'body-parser';
import cors from 'cors';
import logger from '../logger/index.js';
import morgan from 'morgan';
import helmet from 'helmet';
import { API_CALL_LOG_FORMAT, CORS_ORIGIN_URLS, REQUEST_BODY_LIMIT } from '../config/index.js';
import http from 'http';
import { Server as SocketIo } from 'socket.io';

// swagger


export default (app) => {
    logger.info('initializationExpressServer()');

    const corsOptions = {
        origin: CORS_ORIGIN_URLS, // Update this with your allowed origins or use '*'
        methods: 'GET, OPTIONS, PUT, PATCH, POST, DELETE',
        exposedHeaders: 'message,showMessage'
    };

    const stream = {
        write: (message) => {
            logger.info(message);
        },
    };

    app.use(bodyParser.urlencoded({
        limit: `${REQUEST_BODY_LIMIT}mb`,
        extended: true,
    }));

    app.use(bodyParser.json({
        limit: `${REQUEST_BODY_LIMIT}mb`,
    }));

    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(morgan(API_CALL_LOG_FORMAT, { stream }));


    // const swaggerOptions = {
    //     definition: yaml.load(fs.readFileSync('./printx-doc.yaml', 'utf-8')),
    //     apis: ['./routes/*.js'], // Point to your route files
    //   };


    const server = http.createServer(app);
const io = new SocketIo(server,{
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"], 
      credentials: true 
    }
  });

// Store rooms and their participants
const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Create or join a room
  socket.on('joinRoom', (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [socket.id];
      socket.join(roomId);
    } else {
      rooms[roomId].push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit('roomParticipants', rooms[roomId]);
    }
  });

  // Broadcast messages within the room
  socket.on('sendMessage', (roomId, message) => {
    console.log(message)
    io.to(roomId).emit('message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    for (const roomId in rooms) {
      const index = rooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        rooms[roomId].splice(index, 1);
        io.to(roomId).emit('roomParticipants', rooms[roomId]);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


};

