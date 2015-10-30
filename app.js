    var express = require('express'),
    app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs'),
    md5= require('md5');





// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

var users = {}; //liste de tous les utilisateurs; 
var messages = []; // liste de tous les messages
var limitMessages = 5; //limite du nombres de messages 


io.sockets.on('connection',function(socket){

    //Rappatrier tous les utilisateurs déjà connectés
    for( var i in users){
        socket.emit('nouveau_user', users[i]);
    }

    var moi =false;

     /*
    -- GESTION DES NOUVEAUX ARRIVANTS --
    */
    socket.on('nouveau_user', function(user){
        moi = user;
        
        if (user.email != ''){
            moi.avatar = 'https://gravatar.com/avatar/'+md5(user.email)+'?s=300';
            moi.id = user.email.replace('@','-').replace('.','-');
        }
        else{
            moi.avatar ='man-suit.svg';
            moi.id = Math.random() * (100- 0) + 100;;
        }
        socket.emit('nouveau_user',moi);
        users[moi.id]=moi;
    	socket.broadcast.emit('nouveau_user',moi);

        recupPrecedentMsg(moi); // On récupère les anciens messages, présent sur le serveur.
        
    });

    /*
    -- ENVOI DES MESSAGES AUX CLIENTS --
    */

    socket.on('message', function(message){
    	message.user = moi; 
        message.message = ent.encode(message.message); // On encode le message en html 
        messages.push(message); 
        
        if (messages.length > limitMessages)
            messages.shift();
    	socket.broadcast.emit('messageAutre', message);
        socket.emit('messageMoi', message);
    })

    socket.on('disconnect',function(){
        if(!moi)
            return false;
        delete users[moi.id]; // On supprime l'utilisateur qui c'est déconnecté
        socket.broadcast.emit('deconnection', moi);  
    })

    function recupPrecedentMsg(moi){
        //On récupère les messages, et on vérifie si un utilisateur, n'avais pas déjà ecris sur le chat,
        //Si c'est le cas on réaffiche ces précedants messages du bon coté.
        for( var i in messages){
        if (moi.pseudo == messages[i].user.pseudo)
            socket.emit('messageMoi',messages[i]);
        else
            socket.emit('messageAutre',messages[i]);
        }
    }

})



server.listen(8080);