   const jwt = require('jsonwebtoken');
   const User = require('../models/user.model');

   const auth = async (req, res, next) => {
     try {
       const token = req.header('Authorization')?.replace('Bearer ', '');
       
       if (!token) {
         throw new Error();
       }

       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const user = await User.findOne({ _id: decoded.userId });

       if (!user) {
         throw new Error();
       }

       req.user = user;
       req.token = token;
       next();
     } catch (error) {
       res.status(401).json({ message: 'Please authenticate.' });
     }
   };

   const checkSubscription = async (req, res, next) => {
     try {
       if (req.user.subscription.status !== 'active') {
         return res.status(403).json({ message: 'Active subscription required.' });
       }
       next();
     } catch (error) {
       res.status(500).json({ message: 'Error checking subscription status.' });
     }
   };

   module.exports = {
     auth,
     checkSubscription
   };
