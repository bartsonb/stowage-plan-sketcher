const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

const connectDB = async () => {
    await mongoose
      .connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017`)
        .then(() => console.log("Mongo connected successfully"))
        .catch((e) => {
            console.log(e.message);
        });
  };

connectDB();

app.get('/', (req, res) => {
    res.json({ online: true })
});

// API Routes
app.use('/api/sketches', require('./routes/api/sketches'));
app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});