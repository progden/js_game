var HYT = HYT || {};

HYT.renderMenu = function(menuSelector, idx){
	$.ajax({
		url: "template/menu.php",
		type: "GET",
		async: false
	}).done(function(data){
		$.templates("menu", data);
		$(menuSelector).html($.render.menu());
		$(".nav li:nth-child("+idx+")").addClass("active");
	});
};

