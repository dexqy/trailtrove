const mongoose=require('mongoose');
const plm=require('passport-local-mongoose');
const postsschema=require('./posts')
mongoose.connect("mongodb://127.0.0.1:27017/internship");
const userschema= new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post', 
    }],
dp: { type: String }
});
userschema.plugin(plm);
module.exports=mongoose.model('user',userschema)