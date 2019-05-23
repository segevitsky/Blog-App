bodyParser       = require ('body-parser'),
methodOverride   = require('method-override'),
expressSanitizer = require('express-sanitizer'),
mongoose         = require ('mongoose'),
express          = require('express'),
app              = express();


//App config
mongoose.connect('mongodb://localhost/restful_blog_app', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(methodOverride('_method'));

//Mongoose Config
//schema
var blogSchema = new mongoose.Schema ({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//model
var Blog = mongoose.model('Blog', blogSchema);  

//RESTful Routes - all 7 of them//
app.get('/', function(req,res){
    res.redirect('/blogs');
});


// INDEX ROUTE
app.get ('/blogs', function(req,res){
    Blog.find({}, function(err,blogs){
        if(err) {
            console.log('Some bad shit is going on here!');
        } else {
            res.render ('index', {blogs: blogs});
        }
    })
});

//NEW ROUTE
app.get('/blogs/new',function(req,res){
    res.render ('new');
})

//THE CREATE ROUTE
app.post('/blogs',function(req,res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            res.render ('new');
        } else {
             //then redirect to the index
            res.redirect ('/blogs');
        }
    });
});

// THE SHOW ROUTE
app.get('/blogs/:id', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect ('/blog');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

// THE EDIT ROUTE
app.get('/blogs/:id/edit', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
    if(err) {
        res.redirect('/blog');
    }   else {
        res.render('edit', {blog: foundBlog})
    }
    });
})

// THE UPDATE ROUTE
app.put('/blogs/:id', function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// THE DESTROY/DELETE ROUTE
app.delete('/blogs/:id', function(req,res){
    //destroy route
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
    // redirect to the bog page
});





app.listen (80, function(){
    console.log('Fucking Bloggers!');  
});