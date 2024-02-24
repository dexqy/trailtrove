const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String, // Assuming you store the image URL
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Change this line
    ref: 'user', // And add this line
    required: true
  }
});

module.exports = mongoose.model('post', postSchema);


