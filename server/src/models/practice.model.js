   const mongoose = require('mongoose');

   const practiceSchema = new mongoose.Schema({
     user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     },
     testType: {
       type: String,
       enum: ['SAT', 'ACT'],
       required: true
     },
     questions: [{
       question: {
         type: String,
         required: true
       },
       answer: {
         type: String,
         required: true
       },
       userAnswer: String,
       isCorrect: Boolean,
       topic: String,
       difficulty: {
         type: String,
         enum: ['easy', 'medium', 'hard']
       },
       relatedInterest: String
     }],
     score: {
       type: Number,
       required: true
     },
     timeSpent: {
       type: Number, // in minutes
       required: true
     },
     completedAt: {
       type: Date,
       default: Date.now
     }
   }, {
     timestamps: true
   });

   module.exports = mongoose.model('Practice', practiceSchema);
