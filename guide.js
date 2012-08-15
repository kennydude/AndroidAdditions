$(document).ready(function(){
	$.get(document.location.hash.substr(1), function(data){
		$("#body").html(data);
	});
});
