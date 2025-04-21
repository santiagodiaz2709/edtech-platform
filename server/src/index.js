   require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const mongoose = require('mongoose');

   // Import routes
   const authRoutes = require('./routes/auth.routes');
   const testRoutes = require('./routes/test.routes');
   const subscriptionRoutes = require('./routes/subscription.routes');

   const app = express();

   // Middleware
   app.use(express.json());
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));

   // Connect to MongoDB
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('Connected to MongoDB'))
     .catch((err) => console.error('MongoDB connection error:', err));

   // Routes
   app.use('/auth', authRoutes);
   app.use('/api/tests', testRoutes);
   app.use('/api/subscriptions', subscriptionRoutes);

   // Error handling middleware
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({ message: 'Something went wrong!' });
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
