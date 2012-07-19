// AndroidAdditions

function l(h, t, x_id){
	// load item
	$.get(chrome.extension.getURL("content/" + h + "/"+t+".txt"), function(d, x, e){
		$("<div>").addClass("aa-class-op").html(d).appendTo(".add-id-" + x_id);
	});
}

$(document).ready(function(){
	p = document.location.pathname.substr(1);
	p = p.split("/");
	if(p[0] == "reference"){
		// Reference guide
		// Remove ref
		p = jQuery.grep(p, function(k,value) {
			return value != 0;
		});

		// Get rid of .html properly
		x = p[p.length-1].split(".");
		x = jQuery.grep(x, function(value) {
			return value != "html";
		});
		p[p.length-1] = x.join(".");

		h = p.join(".");

		// Request Class Overview
		$.get(chrome.extension.getURL("content/" + h + "/class-ov.txt"), function(d){
			$("<div>").addClass("aa-class-ov").html("<h1>Android Additions Notes</h1>" + d).insertAfter(".jd-descr:first");
		}, "text");
		$.get(chrome.extension.getURL("content/" + h + "/class-ov.js"), function(){}, "script");

		// Get all the detail extras
		var id = 0;
		$(".jd-details").each(function(){
			t = $(".jd-details-title", this).clone();
			$("span.normal", t).remove();
			t = t.text().trim();
			$(this).addClass("add-id-" + id);
			x_id = id;
			id = id+1;

			l(h, t, x_id);
		});
	}
});