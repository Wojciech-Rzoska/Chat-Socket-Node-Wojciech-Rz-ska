//tworzenie serwera
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//nasluchiwanie serwera przez sokety
var io = require('socket.io').listen(server);
//tabllice
users = [];
connections = [];

//nasluchiwanie serwera
server.listen(process.env.PORT || 3000);
console.log('server running');

//łaczenie się z plikiem index
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//połączenie 
io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //disconnect
    socket.on('disconnect', function(data){
        //.splice Zmienia zawartość tablicy, dodając nowe elementy podczas usuwania starych elementów.
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s socket connected', connections.length);
    
    });
    //message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user:socket.username});
    });

    //socket.on.... nasłuchiwanie zdarzenia z gniazda o podanej nazwie po czym uruchamia podaną funkcję 
    //new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

});
