var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var expressSanitizer = require("express-sanitizer");
var methodOverride = require('method-override');




//app Config 
mongoose.connect("mongodb://localhost/restful");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));


//Mongoose -model  CONFIG 
var blogSchema = new mongoose.Schema({
    title: String, 
    image: String,
    body: String, 
    created: { type: Date, default: Date.now} 
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

//redirect
app.get("/", function(req, res){
    res.redirect('blogs');
});


//INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blog){
      if(err){
        console.log("ERROR!");
    }else{
        res.render('index', {blogs: blog});  
    }
        
    });

});

//NEW
app.get('/blogs/new', function(req, res){
    res.render('new');
});

//CREATE 
app.post('/blogs', function (req, res){
    //sanatize data
    req.body.blog.body = req.sanitize(req.body.blog.body);
     var formData = req.body.blog;
    //create blog
    Blog.create(req.body.blog, function ( err, newBlog){
    if(err){
       res.render("new");
    }else{ 
         //redirect
        res.redirect("/blogs");
    }
        
    });
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
      if(err){
          res.redirect("/");
      } else {
          res.render("show", {blog: blog});
      }
   });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/");
       } else {
           res.render("edit", {blog: blog});
       }
   });
});
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});

//DELETE ROUTE 
app.delete("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           blog.remove();
           res.redirect("/blogs");
       }
   }); 
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log('SERVER IS RUNNING, GET YOUR WORK DONE!');
    
});


/*Blog.create({
    title: "ROCKY", 
    image: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    body: " CONCERTS Tickets TOURS", 
    created:""
    }, function(err, blog){
            if(err){
                console.log(err);
            }else{
                console.log("NEW ADDED");
                console.log(blog);
            }}
            );*/

