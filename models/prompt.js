const mongoose = require('mongoose');
const {Schema} = mongoose;

const promptSchema = new mongoose.Schema({
  Prompt: { 
    type: String, 
    required: true 
},
  Answer: { 
    type: String, 
    required: true 
    },
});

module.exports = mongoose.model("Prompt", promptSchema);
