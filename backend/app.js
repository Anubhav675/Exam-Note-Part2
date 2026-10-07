const express = require('express');
const cors = require('cors');
const workoutRouter = require('./routes/workoutRouter');
const userRouter = require('./routes/userRouter')
const { unknownEndpoint, errorHandler, requestLogger } = require('./middleware/customMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/workouts', workoutRouter);
app.use('/api/users', userRouter);

app.use(express.static('view'));
// Error handling
app.use(unknownEndpoint);
app.use(errorHandler);

app.use((req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

module.exports = app;

