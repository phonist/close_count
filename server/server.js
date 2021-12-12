require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const httpStatus = require('http-status');
const compression = require('compression');
const app = express();

const PORT = process.env.PORT || 8001;

// Connect Database
connectDB();

// set security HTTP headers
// app.use(helmet());

//parse json request body
app.use(express.json()); // for parsing application/json app.use(bodyParser.json());

//parse urlencdoded data
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//sanitize request data
// app.use(xss());
// app.use(mongoSanitize());

//gzip compression
// app.use(compression());

// enable cors
// app.use(cors());
// app.options('*', cors());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/timers',require('./routes/api/timers'));

app.use((err, req, res, next) => {
  console.log('err',err);
  next();
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('Production mode');

  // Set static folder 
  // const root = path.join(__dirname, '..', 'client','build');
  // const root = __dirname;
  // console.log(root);
  app.use(express.static('client/build'));

  app.get("*", (req, res) => {
    console.log('req.url',req.url);
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
 