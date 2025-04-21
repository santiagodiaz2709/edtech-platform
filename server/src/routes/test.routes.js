   const express = require('express');
   const { auth, checkSubscription } = require('../middleware/auth.middleware');
   const Diagnostic = require('../models/diagnostic.model');
   const Practice = require('../models/practice.model');

   const router = express.Router();

   // Generate a practice test based on user's interests and performance
   router.post('/generate', auth, checkSubscription, async (req, res) => {
     try {
       const { testType } = req.body;
       
       // For now, using dummy data - in production, this would use an AI model
       // or a sophisticated algorithm to generate personalized questions
       const mockQuestions = [
         {
           question: `A basketball player scores an average of ${req.user.interests.includes('NBA') ? '30' : '20'} points per game. 
                     If the season has 82 games, how many points will they score in total?`,
           answer: req.user.interests.includes('NBA') ? '2460' : '1640',
           topic: 'Mathematics',
           difficulty: 'medium',
           relatedInterest: 'NBA'
         },
         {
           question: 'What is the main theme of the song "Bohemian Rh
