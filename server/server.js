const express = require('express');
// const connectDB = require('./config/db');//uncomment this line in your local working directory
const path = require('path');

const app = express();

// Connect Database
// connectDB();//uncomment this line in your local working directory

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/timers',require('./routes/api/timers'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));//uncomment this line in your local working directory
