var express = require('express');
var path = require('path');
var config = require('./config/config.js');
var fs = require('fs');
var watch = require('watch');
var chokidar = require('chokidar');
var sleep = require('sleep');
var child = require('child_process').spawn('java', ['-jar', 'sleep.jar']);

child.stdout.on('data', function(data) {
    console.log(data.toString());
});

child.stderr.on("data", function (data) {
    console.log(data.toString());
});


var app = express();
var bodyParser = require('body-parser');
//req.body contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as body-parser and multer.
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
//change to port 80 so that namecheap can redirect 
app.set('port', process.env.PORT || 3000);
app.set('host', config.host);

require('./routes/routes.js')(express, app, fs, config, child);
/*
Reports the event twice. Wow, I can't believe the Node library had a bug...
fs.watch("./textfiles/link.txt", function(){
    fs.readFile("./textfiles/test.txt", "utf8", function (error, data) {
            console.log(data);
    });
});
*/

var clientSocket;
io.on('connection', function (socket) {
    clientSocket = socket;
});


chokidar.watch('./textfiles/done.txt').on('change', function(){
    console.log('Took too long!');
    clientSocket.emit('tookTooLong', {});
})

chokidar.watch('./textfiles/invalid.txt').on('change', function(){
    console.log('Invalid article!');
    clientSocket.emit('invalidArticle', {});
})

chokidar.watch('./textfiles/outputTitles.txt').on("change", function(){
    
    //sleep for 0.1 seconds to allow time for Java program to write the contents of the file
    sleep.usleep(100000);
    fs.readFile("./textfiles/outputTitles.txt", "utf8", function (error, data) {
        if (clientSocket !== undefined) {
            clientSocket.emit('articleNames', data);
            console.log('output titles after:' + data);
        }
    });
})

chokidar.watch('./textfiles/outputLinks.txt').on("change", function(){
    sleep.usleep(100000);
    fs.readFile("./textfiles/outputLinks.txt", "utf8", function (error, data) {
        if (clientSocket !== undefined) {
            clientSocket.emit('articleLinks', data);
            //console.log('data of output links:' + data);
        }
    });
})

//require('./socket/socket.js')(io, linkData);

server.listen(app.get('port'), function(){
    console.log('Project XXX working on port: ' + app.get('port'));
})
