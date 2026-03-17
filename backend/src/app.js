
const express = require("express");
const cors = require("cors");
const taskRoutes = require('./features/tasks');
const userRoutes = require('./features/user');
const authRoutes = require('./features/auth')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// test server 
app.get('/health',(req, res)=> {
    res.send('Server is Working ')
})


module.exports = app;

