'use strict'
module.exports = function(express, app, fs){
    
    let router = express.Router();

    //app.get(path, callback) routes HTTP GET requests to the specified path with the specified callback function 
    router.get('/', function(req, res){
        //terminate the connection with the server with a res.render method 
        res.render('index', {});
    });
    
    router.post('/link', function(req, res){
      var start = req.body.start;
      var end = req.body.end;
//      var html = 'Starting link is: ' + start + '<br>' +
//                    'Ending link is: ' + end + '<br>' +
//                 '<a href="/">Click here to get results!</a>';
        
      fs.writeFile("./textfiles/link.txt", start + "\n" + end, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
      });   
        
        res.redirect('/');

    });
    
    
    

    app.use('/', router);
}
