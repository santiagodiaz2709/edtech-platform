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
           question: 'What is the main theme of the song "Bohemian Rhapsody"?',
           answer: 'The internal struggle and confession of a young man',
           topic: 'Reading Comprehension',
           difficulty: 'hard',
           relatedInterest: 'music'
         }
       ];

       const practice = new Practice({
         user: req.user._id,
         testType,
         questions: mockQuestions,
         score: 0,
         timeSpent: 0
       });

       await practice.save();

       res.json({ test: practice });
     } catch (error) {
       res.status(500).json({ message: 'Error generating test' });
     }
   });

   // Submit diagnostic test results
   router.post('/diagnostic', auth, async (req, res) => {
     try {
       const { testType, sections, totalScore } = req.body;

       const diagnostic = new Diagnostic({
         user: req.user._id,
         testType,
         sections,
         totalScore
       });

       await diagnostic.save();

       res.status(201).json({ diagnostic });
     } catch (error) {
       res.status(500).json({ message: 'Error saving diagnostic results' });
     }
   });

   // Get user's practice history
   router.get('/history', auth, async (req, res) => {
     try {
       const practices = await Practice.find({ user: req.user._id })
         .sort({ createdAt: -1 })
         .limit(10);

       res.json({ practices });
     } catch (error) {
       res.status(500).json({ message: 'Error fetching practice history' });
     }
   });

   // Get user's diagnostic results
   router.get('/diagnostic', auth, async (req, res) => {
     try {
       const diagnostics = await Diagnostic.find({ user: req.user._id })
         .sort({ createdAt: -1 });

       res.json({ diagnostics });
     } catch (error) {
       res.status(500).json({ message: 'Error fetching diagnostic results' });
     }
   });

   module.exports = router;
