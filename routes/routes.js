'use strict'
module.exports = function(express, app, fs, config){
    
    var router = express.Router();

    router.get('/', function(req, res){
        res.render('index', {});
    });
    
    //handle a get request to this link in case the user refreshes the page 
    //the only time you maintain the post action method in the url is if you do a res.render()
    router.get('/link', function(req, res){
       res.redirect('/'); 
    })
    
    router.post('/link', function(req, res){
      var start = req.body.start;
      var end = req.body.end;   
      fs.writeFile("./textfiles/link.txt", start + "\n" + end, function(err) {
        if(err) {
            return console.log(err);
        }
      }); 
        res.send({config: config});
        
       /*
        res.render('index', {config: config});
        if you try to console.log(data) in the ajax done method by ending the response with a res.render(), 
        you'll print out the entire html of the index page because the ajax callback function is expecting a
        javascript object 
        therefore, what you could do instead is send the url of the page you want to go to instead (say it's index),
        and then in the ajax callback function set document.location = theUrl 
        if you also want to persist data from the backend to the frontend and use an ajax call to change the page, 
        you could send the client an object with the url of the new page and the information you want to persist 
        from the node server. then you can store that entire object in a session storage, local storage, or
        query string. However, if you want to store an object and not a string, you have to first use JSON.stringify
        on that object and later use JSON.parse to get it back when you want to use it again 
        */
       
    });
    
    app.use('/', router);
}
