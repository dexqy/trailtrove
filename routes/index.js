var express = require('express');
var router = express.Router();
const localstrategy=require("passport-local");
const passport = require('passport');
const usermodel=require("./users");
const postmodel=require("./posts");
const upload=require("./multer")
passport.use(new localstrategy(usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/add', function(req, res, next) {
  res.render('add');
});
router.get('/budgetcalc', function(req, res, next) {
  res.render('budgetcal');
});
router.get('/convertor', function(req, res, next) {
  res.render('convertor');
});
router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/gallery', function(req, res, next) {
  res.render('gallery');
});
router.get('/product', function(req, res, next) {
  res.render('product');
});

router.get('/delete/:postId', async (req, res) => {
  try {
  
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).send({ error: 'Post ID is missing' });
    }

  
    await postmodel.deleteOne({ _id: postId });
    res.status(200).send({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});


router.get('/login', function(req, res, next) {
  res.render('login', {error:req.flash('error')});
});
router.get('/register', function(req, res, next) {
  res.render('register', );
}); 
function isloggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
router.get('/profile',isloggedin, async function(req, res, next){
  const user=await usermodel.findOne({
    username:req.session.passport.user
  }).populate('posts')
  res.render('profile',{user});
  
});
router.get('/feed',isloggedin, async function(req, res, next){
  const user=await usermodel.find({}).populate('posts')
  console.log(user);
  res.render('feed',{user});
  
});
router.get('/fullpost/:postId',isloggedin, async function(req, res, next){
  const postId = req.params.postId;
  const post = await postmodel.findById(postId).populate('user'); 
  res.render('maximize', { post }); 
  
});

router.get('/logout', function(req, res){
  req.logout(function(err){
    if (err) return next(err);
    res.redirect('/');
  })
})
router.post('/register', function(req, res, next) {
  const  userdata= new usermodel({
      username: req.body.username,
      email:req.body.email,
      name: req.body.name,
      description:req.body.description,
      password:req.body.password
    });
    usermodel.register(userdata,req.body.password).then(function(registereduser){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile");
        
      })
    });
  });
  
  
router.post('/login', passport.authenticate('local', {
    successRedirect: "/profile",
    failureRedirect: '/',
    failureFlash:true
  }), function(req, res) {
  });
  
// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) {
//       console.error('Error during authentication:', err);
//       return next(err);
//     }
//     if (!user) {
//       console.log('Authentication failed. No user found.');
//       return res.redirect('/login');
//     }
//     req.logIn(user, function(err) {
//       if (err) {
//         console.error('Error during login:', err);
//         return next(err);
//       }
//       console.log('User successfully logged in:', user);
//       return res.redirect('/profile');
//     });
//   })(req, res, next);
// });
router.post("/upload",isloggedin,upload.single('file'), async function(req,res,next){
  if(!req.file){
    return res.status(400).send ("no files werwe uploaded");
  }
const user=await usermodel.findOne({
  username: req.session.passport.user

});
const post=await postmodel.create({
  image:req.file.filename,
  title:req.body.title,
  description:req.body.description,
  link:req.body.link,
  user:user._id
})
 user.posts.push(post._id);
 await user.save();
 res.redirect("/profile")
});
router.post("/profileupload",isloggedin,upload.single('pic'), async function(req,res,next){
  if(!req.file){
    return res.status(400).send ("no files werwe uploaded");
  }
const user=await usermodel.findOne({
  username: req.session.passport.user

});
user.dp=req.file.filename;
await user.save();
res.redirect("/profile")
});

 
module.exports = router;
