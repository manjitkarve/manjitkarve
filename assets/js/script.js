$(document).ready(function(){
	if (window.location.pathname==="/"){
		$("body").attr("pagename", "index");
	} else {
		$("body").attr("pagename", window.location.pathname.substr(0,    window.location.pathname.indexOf(".shtml")).substr(1));
	}
	
	$("#pageContainer>main").perfectScrollbar();

	$(".scorable").click(function(){
		$(this).toggleClass("scoreOn");
	}).mouseout(function(){
		$(this).removeClass("scoreOn");
	});
});
