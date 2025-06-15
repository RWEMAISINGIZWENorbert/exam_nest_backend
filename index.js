require('dotenv').config();
const express = require('express');
const { default: dbConnect } = require('./config/db_connect');
const fileRoutes = require('./routes/fileRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);

dbConnect().then(() => 
   app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))
);
