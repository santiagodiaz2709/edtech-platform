   const express = require('express');
   const { body, validationResult } = require('express-validator');
   const jwt = require('jsonwebtoken');
   const User = require('../models/user.model');
   const { auth } = require('../middleware/auth.middleware');

   const router = express.Router();

   // Register user
   router.post('/register',
     [
       body('email').isEmail().normalizeEmail(),
       body('password').isLength({ min: 6 }),
       body('name').trim().notEmpty()
     ],
     async (req, res) => {
       try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }

         const { email, password, name } = req.body;

         const existingUser = await User.findOne({ email });
         if (existingUser) {
           return res.status(400).json({ message: 'Email already registered' });
         }

         const user = new User({
           email,
           password,
           name
         });

         await user.save();

         const token = jwt.sign(
           { userId: user._id },
           process.env.JWT_SECRET,
           { expiresIn: process.env.JWT_EXPIRATION }
         );

         res.status(201).json({
           token,
           user: {
             id: user._id,
             email: user.email,
             name: user.name
           }
         });
       } catch (error) {
         res.status(500).json({ message: 'Error creating user' });
       }
     }
   );

   // Login user
   router.post('/login',
     [
       body('email').isEmail().normalizeEmail(),
       body('password').notEmpty()
     ],
     async (req, res) => {
       try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }

         const { email, password } = req.body;

         const user = await User.findOne({ email });
         if (!user) {
           return res.status(401).json({ message: 'Invalid credentials' });
         }

         const isMatch = await user.comparePassword(password);
         if (!isMatch) {
           return res.status(401).json({ message: 'Invalid credentials' });
         }

         const token = jwt.sign(
           { userId: user._id },
           process.env.JWT_SECRET,
           { expiresIn: process.env.JWT_EXPIRATION }
         );

         res.json({
           token,
           user: {
             id: user._id,
             email: user.email,
             name: user.name,
             subscription: user.subscription
           }
         });
       } catch (error) {
         res.status(500).json({ message: 'Error logging in' });
       }
     }
   );

   // Get current user
   router.get('/me', auth, async (req, res) => {
     try {
       res.json({
         user: {
           id: req.user._id,
           email: req.user.email,
           name: req.user.name,
           interests: req.user.interests,
           subscription: req.user.subscription
         }
       });
     } catch (error) {
       res.status(500).json({ message: 'Error fetching user data' });
     }
   });

   // Update user interests
   router.patch('/me/interests', auth, async (req, res) => {
     try {
       const { interests } = req.body;
       if (!Array.isArray(interests)) {
         return res.status(400).json({ message: 'Interests must be an array' });
       }

       req.user.interests = interests;
       await req.user.save();

       res.json({ interests: req.user.interests });
     } catch (error) {
       res.status(500).json({ message: 'Error updating interests' });
     }
   });

   module.exports = router;
