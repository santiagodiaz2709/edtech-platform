   const mongoose = require('mongoose');

   const diagnosticSchema = new mongoose.Schema({
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
     sections: [{
       name: {
         type: String,
         required: true
       },
       score: {
         type: Number,
         required: true
       },
       totalQuestions: {
         type: Number,
         required: true
       },
       correctAnswers: {
         type: Number,
         required: true
       },
       topics: [{
         name: String,
         performance: {
           type: String,
           enum: ['weak', 'moderate', 'strong']
         }
       }]
     }],
     totalScore: {
       type: Number,
       required: true
     },
     completedAt: {
       type: Date,
       default: Date.now
     }
   }, {
     timestamps: true
   });

   module.exports = mongoose.model('Diagnostic', diagnosticSchema);
