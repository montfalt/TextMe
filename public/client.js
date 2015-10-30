// Connexion à socket.io
var socket = io.connect('http://localhost:8080');
var pseudo = '';

 /*
    -- RECUPERATION ET ENVOIE 
    -- DES DONNEES DE CONNECTION AU SERVEUR PSEUDO/EMAIL --
 */
$('#formulaire_connection').submit(function (event) {
    event.preventDefault(); // Permet de bloquer l'envoi "classique" du formulaire
    if ($('#pseudo').val() != '') {
		socket.emit('nouveau_user',{
            pseudo : $('#pseudo').val(),
            email  : $('#email').val()
        });
		document.title = $('#pseudo').val() + ' - ' + document.title;
		$('#page1').fadeOut();
		$('#users_scroll_lateral').delay(400).animate({'width':'15%','opacity':'1'});
        $('#message').val('').focus();
    }
    else{
       $('#alert_Pseudo').animate({'opacity':'1'});
    }

});

/*
    -- RECUPERATION ET ENVOIE DES MESSAGES
 */
$('#formulaire_chat').submit(function (event) {
    event.preventDefault(); // Permet de bloquer l'envoi "classique" du formulaire
    socket.emit('message', {message: $('#message').val()}); // Transmet le message au serveur
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
});

/*
    -- AFFICHAGES DES MESSAGES 
 */
socket.on('messageAutre', function (data) {
   insererMessage_Autre(data.user.pseudo, data.message);
   scrollAuto('#scroll');
})
socket.on('messageMoi', function (data) {
   insererMessage_Moi(data.user.pseudo, data.message);
   scrollAuto('#scroll');
})

/*
    -- AFFICHAGES DES CONNECTIONS 
 */
socket.on('nouveau_user', function(user) {
    $('#chat_zone').append('<p id="user_in_out"><em>' + user.pseudo + ' a rejoint le Chat !</em></p>');
    $('#users').append('<span id="user_'+user.pseudo+'"><div class="arrondi"><img src="'+user.avatar+'" id="avatar"></div><p>'+ user.pseudo + '</p></span>');
    scrollAuto('#scroll');
    scrollAuto('#users_scroll_lateral');
})

/*
    -- AFFICHAGES DES DECONNECTIONS 
 */
socket.on('deconnection', function(user){
	$('#chat_zone').append('<p id="user_in_out"><em>' + user.pseudo + ' a quitté le Chat !</em></p>');
	$('#user_'+user.pseudo).remove();
    scrollAuto('#scroll');
    scrollAuto('#users_scroll_lateral');
})
 

/*
    -- FONCTION D'AFFICHAGE 
 */
function insererMessage_Moi(pseudo, message) {

    $('#chat_zone').append('<p id="ms_left"><strong>' + pseudo + '</strong> ' + message + '</p>');
}
function insererMessage_Autre(pseudo, message) {

    $('#chat_zone').append('<p id="ms_right">'+ message + ' <strong>' + pseudo + '</strong> </p>');
}


// Fonction pour gérer le scroll automatiquement
function scrollAuto(divScroll){
    $(divScroll).animate({scrollTop : $(divScroll).prop('scrollHeight')}, 50);
}
