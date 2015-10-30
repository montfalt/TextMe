$(document).ready(function() 
{

	var BlocLogin = $('#login');
	var BlocUsers = $('#users_scroll_lateral');

	$('#alert_Pseudo').css({'opacity':'0'});
	$(BlocUsers).css({'width':'0%', 'opacity':'0'});
	//$(BlocUsers).delay(2000).animate({'width':'10%'});

	
	$(BlocLogin).css({'top':'-150px', 'opacity':'0'});

	//APPARITION DES ELEMENTS 
	$(BlocLogin).animate({'top':'0','opacity':'1'}, 700);
	
})

