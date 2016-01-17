'use strict'
module.exports = function(express, app, fs, config){
    
    let router = express.Router();

    router.get('/', function(req, res){
        res.render('index', {});
    });
    
    //handle a get request to this link in case the user refreshes the page 
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
        //another way to get a new view with an ajax request is to 
       //res.render('index', {config: config});
    });
    
    app.use('/', router);
}
